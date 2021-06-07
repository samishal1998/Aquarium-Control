const {
	app,
	BrowserWindow,
	ipcMain,
} = require('electron');
const isDev = require("electron-is-dev");
const path = require("path");
const ByteLength = require('@serialport/parser-byte-length')
const SerialPort = require('serialport');
const log = require('electron-log');


var serialPort = undefined;
const baudRate = 9600;
var portObj = undefined;
var parser = undefined;

const structSize= 9;
var dataBuffer = undefined;
var stream = undefined;
var receivedSeq = undefined;
const startSeqArray = [1, 27, 6, 27, 4]
const startSeq = Buffer.from(startSeqArray);
var toggle = true
var win;
function createWindow() {
	win = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		useContentSize: true,
		icon: path.join(__dirname, "icon.png"),
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js")
		}
	})

	win.loadURL(isDev ?
		"http://localhost:3000" :
		`file://${path.join(__dirname, "../build/index.html")}`)
	if (isDev)
		win.webContents.openDevTools()
	log.info("Testing ... ")

	SerialPort
		.list()
		.then((ports) => {
			log.warn(ports)
		})

	win.maximize();
}

app
	.whenReady()
	.then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = undefined
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

ipcMain.on(
	'serial-port-open',
	(_, arg) => {

		console.log(arg);
		portObj = arg;

		if(serialPort) serialPort.close(console.log);
		
		serialPort = initSerial(arg);

		serialPort.on('open', () => console.log("Opened Event"))
		initParser();

	})

ipcMain.on('serial-port-close', (_, arg) => {
	console.log(`close: ${arg}`);
	try {
		serialPort.close(console.log)
	} catch (e) {
		console.log(`Error close: ${arg}`);
	}
});

onToggle();
onRequestSerialList();
onSerialTransmission();

function updateTemperature(message) {
	win.webContents.send('data-temperature-update', message);
	
};
function updateOxygen(message) {
	win.webContents.send('data-oxygen-update', message);
};

function updateConfiguration(message) {
	win.webContents.send('data-config-update', message);
};

function onToggle() {
	ipcMain.on('data-toggle', (_,{buffer})=>{
		console.log(`toggle :: ${buffer}\n`);
		if (serialPort) {
			var buf = Buffer.alloc(1);
			buf.writeInt8((buffer))
			console.log(`TX :: ${buf.toString()}\n`);
			serialPort.write(buf)
		}
	});
};

// function onToggleHeater() {
// 	ipcMain.on('data-heater-toggle', (_,{heaterState})=>{
// 		console.log(`heaterToggle :: ${heaterState}\n`);
// 		if (serialPort) {
// 			var buf = Buffer.alloc(1);
// 			buf.writeInt8((heaterState)?1:0)
// 			console.log(`TX :: ${buf.toString()}\n`);
// 			serialPort.write(buf)
// 		}
// 	});
// };

// function onToggleAerator() {
// 	ipcMain.on('data-aerator-toggle', (_,{aeratorState})=>{
// 		console.log(`aeratorToggle :: ${aeratorState}\n`);
// 		if (serialPort) {
// 			var buf = Buffer.alloc(1);
// 			buf.writeInt8((aeratorState)?2:0)
// 			console.log(`TX :: ${buf.toString()}\n`);
// 			serialPort.write(buf)
// 		}
// 	});
// };

function initSerial({path,baudRate}) {
	return new SerialPort(path, {
		baudRate: parseInt(baudRate),
		dataBits: 8,
		stopBits: 2,
		parity: "odd",
		rtscts: false,
		xon: false,
		xoff: false,
		highWaterMark: 8,
		lock: true,
		autoOpen: true
	}, () => {
		console.log("Opened Callback")
	})
};

function initParser() {

	parser = serialPort.pipe(new ByteLength({
		length: 1
	}))

	parser.on('data', (buffer) => {
		//console.log(`buffer ${buffer} - Length: ${buffer.length}`)
		const dataByte = buffer.readInt8();

		if (stream) {
			//console.log(`Stream initialized`)
			if (stream.length > structSize)
				stream = undefined;
			else {
				if (stream.length < structSize)
					stream.push(dataByte)
				if (stream.length == structSize) {
					dataBuffer = Buffer.from(stream)
					
					console.log(`1-buffer ${dataBuffer.toString()} - Length: ${dataBuffer.length} \n`)
					console.log(`2-buffer ${stream} \n`);

					let slice_1 = dataBuffer.slice(0,4).readFloatLE();
					let slice_2 = dataBuffer.slice(4,8).readFloatLE();
					let slice_3 = dataBuffer.slice(8,9).readInt8();
					updateTemperature(slice_1);
					updateOxygen(slice_2);
					updateConfiguration(slice_3);


					stream = undefined;
					console.log(`Slice 1: ${slice_1}`)
					console.log(`Slice 2: ${slice_2}`)
					console.log(`Slice 2: ${slice_3}`)
					
				}
			}

		} else if (startSeqArray.includes(dataByte)) {
			
			if (!receivedSeq) {
				if (dataByte == startSeqArray[0]) {
					receivedSeq = [dataByte]
				}

			} else {
				if (receivedSeq.length > 5) {
					receivedSeq = []
				} else {
					if (receivedSeq.length < 5) {
						receivedSeq.push(dataByte)
					}
					if (receivedSeq.length == 5) {

						if (Buffer.from(receivedSeq).compare(startSeq) == 0) {
							console.log(`receivedSeq ${receivedSeq}`)
							stream = []
						}

						receivedSeq = undefined

					}
				}
			}

			// console.log(`Float 1: ${buffer.slice(0,2).readInt16LE()}`) console.log(`Float
			// 2: ${buffer.slice(2,4).readInt16LE()}`)

			// serialPort.on('data', (buffer) => { 	console.log(`buffer ${buffer} - Length:
			// ${buffer.length}`) }) serialPort.read
		}
	})
};

function onRequestSerialList(){
	ipcMain.on('serial-ports-list', (event, arg) => {
		SerialPort
			.list()
			.then((ports) => {
				event.reply("serial-ports-list-reply", ports);
			})
	
	})
}

function onSerialTransmission(){

	ipcMain.on('serial-transmission', (event, arg) => {
		console.log(arg);
		if (serialPort) {
			var buf = Buffer.alloc(1);
			const character = (toggle)?'A':'B'
			buf.writeInt8(character.charCodeAt())
			toggle= !toggle
			console.log(`TX :: ${buf.toString()}\n`);
			serialPort.write(buf)
	
		}
	})

}