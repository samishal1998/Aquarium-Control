import "./App.css";
import React from "react";
import { PortList } from "./components/PortList.js";

import dateFormat from "dateformat";
import PlotWithGauge from "./components/PlotWithGauge.js";
import { IOSSwitch } from "./components/CustomizedSwitches.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { FormGroup,FormControlLabel } from "@material-ui/core";
const { electron } = window;
const { serialApi, dataAPI } = electron;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			portsList: [],
			temperature: [{ x: 0, y: 0 }],
			oxygen: [{ x: 0, y: 0 }],
			heaterState: false,
			aeratorState: false,
			refreshRate: 0,
		};

		this.refreshRateOptions = Array.from({ length: 64 }, (v, k) => ({
			index: k,
			label: `${(k + 1) * 2} s`,
		}));

		serialApi.listenToPortList((event, portsList) => {
			console.log("Received ", portsList);
			this.setState({ portsList });
		});

		dataAPI.listenToConfig((_, message) => {
			const refreshRate = message >>> 2;
			const heaterState = (1 & message) == 1;
			const aeratorState = (2 & message) == 2;
			this.setState({ refreshRate, heaterState, aeratorState });
		});

		dataAPI.listenToTemperature((_, message) => {
			//console.log(`new temp : ${message}`)

			const { temperature } = this.state;
			temperature.push({
				x: dateFormat(new Date(), "HH:MM:ss"),
				y: message,
			});
			this.setState({ temperature });
		});
		dataAPI.listenToOxygen((_, message) => {
			//console.log(`new oxygen : ${message}`)
			const { oxygen } = this.state;
			oxygen.push({ x: dateFormat(new Date(), "HH:MM:ss"), y: message });
			this.setState({ oxygen });
		});
	}

	handleRequest = () => {
		serialApi.getPortList();
	};

	handlePortSelect = (port) => {
		serialApi.openPort(port);
	};
	handlePortDeselect = (port) => {
		serialApi.closePort(port);
	};

	transmit = () => {
		const { heaterState, aeratorState, refreshRate } = this.state;
		let buffer =
			(heaterState ? 1 : 0) + (aeratorState ? 2 : 0) + 4 * refreshRate;
		dataAPI.toggle({ buffer });
	};

	handleChangeRefreshRate = ({ target: { value } }) => {
		this.setState({ refreshRate: value }, this.transmit);
	};

	toggleHeater = () => {
		this.setState({ heaterState: !this.state.heaterState }, this.transmit);
	};
	toggleAerator = () => {
		this.setState(
			{ aeratorState: !this.state.aeratorState },
			this.transmit
		);
	};
	handleTransmission = () => {
		serialApi.transmit(0);
	};

	render() {
		const {
			portsList,
			temperature,
			oxygen,
			heaterState,
			aeratorState,
			refreshRate,
		} = this.state;

		return (
			<div className="container-fluid">
				<div
					className="container-fluid  mx-20 align-items-center" /*  style={style.container} */
				>
					<div className="row d-flex justify-content-center">
						<PlotWithGauge
							label={"Temperature"}
							xLabel={"Time"}
							yLabel={"Temperature"}
							series={{
								id: "oxygen",
								color: "hsl(291, 70%, 50%)",
								data: temperature,
							}}
							gaugeLimits={{ min: 0, max: 330 }}
							formatter={(percent, value, start, end) =>
								`${value} \u00B0C`
							}
							showLast={10}
						/>
					</div>
					<div className="row d-flex justify-content-center">
						<PlotWithGauge
							label={"Dissolved Oxygen"}
							xLabel={"Time"}
							yLabel={"Dissolved Oxygen"}
							series={{
								id: "Dissolved oxygen",
								color: "hsl(291, 70%, 50%)",
								data: oxygen,
							}}
							gaugeLimits={{ min: 0, max: 100 }}
							formatter={(percent, value, start, end) =>
								`${value} mg/dL`
							}
							showLast={10}
						/>
					</div>

					<div className="row my-5 d-flex justify-content-center">
						<FormGroup row>
						<FormControlLabel
							label="Refresh Rate"
							control={
							<Select
								id="demo-customized-select"
								value={refreshRate}
								onChange={this.handleChangeRefreshRate}
								input={<BootstrapInput />}
								style={{ paddingRight: '5px' }}
							>
								{this.refreshRateOptions.map(
									({ index, label }) => (
										<MenuItem value={index}>
											<em>{label}</em>
										</MenuItem>
									)
								)}
							</Select>}>
						</FormControlLabel>

						<FormControlLabel
							control={
								<IOSSwitch
									checked={heaterState}
									onChange={this.toggleHeater}
									name="heater"
								/>
							}
							label="Heater"
						/>

						<FormControlLabel
							control={
								<IOSSwitch
									checked={aeratorState}
									onChange={this.toggleAerator}
									name="aerator"
								/>
							}
							label="Aerator"
						/>
						</FormGroup>
					</div>
					<div className="container row mt-20 mb-50 mx-auto d-flex justify-content-center">
						<PortList
							portsList={portsList}
							onSelect={this.handlePortSelect}
							onDeselect={this.handlePortDeselect}
							refreshPorts={this.handleRequest}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
const style = {
	container: {
		marginHorizontal: 20,
	},
	slider: {
		code: {
			color: "rgba(0, 0, 0, 0.65)",
		},
	},
	button: {
		backgroundColor: "rgba(0,18,51,0.8)",
		borderColor: "#003870",
		fontSize: "2rem",
		borderRadius: ".75rem",
	},
	arrow: {
		backgroundColor: "rgba(0,18,51,0.8)",
		borderColor: "rgba(0,18,51,0.2)",
		borderRadius: "100%",
	},
	graphs: {
		minHeight: 150,
		minWidth: 200,
	},
};

const BootstrapInput = withStyles((theme) => ({
	root: {
		"label + &": {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		position: "relative",
		backgroundColor: theme.palette.background.paper,
		border: "1px solid #ced4da",
		fontSize: 16,
		padding: "10px 26px 10px 12px",
		transition: theme.transitions.create(["border-color", "box-shadow"]),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
		"&:focus": {
			borderRadius: 4,
			borderColor: "#80bdff",
			boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
		},
	},
}))(InputBase);

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
}));
