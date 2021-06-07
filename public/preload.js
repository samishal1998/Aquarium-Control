const { ipcRenderer,ipcMain, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron',
{
    notificationsApi:{
        sendNotification(message){
            console.log(message)
            ipcRenderer.send('notify',message)
        }
    },

    serialApi:{
        getPortList(){
            console.log("request-port-list")
            ipcRenderer.send('serial-ports-list')
        },

        transmit(message){
            ipcRenderer.send('serial-transmission',message)
        },
        openPort(message){
            ipcRenderer.send('serial-port-open',message)
        },
        closePort(message){
            ipcRenderer.send('serial-port-close',message)
        },
        listenToPortList(callback){
            ipcRenderer.on("serial-ports-list-reply", callback);
        }

    },
    dataAPI: {
        listenToTemperature(callback) {
            ipcRenderer.on('data-temperature-update', callback);
        },
        listenToOxygen(callback) {
            ipcRenderer.on('data-oxygen-update', callback);
        },
        listenToConfig(callback) {
            ipcRenderer.on('data-config-update', callback);
        },
        toggleHeater(message){
            ipcRenderer.send('data-heater-toggle',message)
        },
        toggleAerator(message){
            ipcRenderer.send('data-aerator-toggle',message)
        },
        toggle(message){
            ipcRenderer.send('data-toggle',message)
        },
        
    },
        
    receive: (channel, func) => {
        ipcRenderer.on(channel, func);
    },
    send: (channel, message) => {
        ipcRenderer.send(channel, message);
    }
}
)
window.ipcRenderer = require('electron').ipcRenderer;
