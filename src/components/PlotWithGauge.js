import React from "react";
import PropTypes from "prop-types";
import { Gauge } from "../APEX/ApexChart.js";
import MyResponsiveLine from "./Graph.js";

class PlotWithGauge extends React.Component {

	render() {
		const {
			label,
			formatter,
			yLabel,
			xLabel,
			series,
			series:{data},
			gaugeLimits: { min, max },
            showLast,
		} = this.props;


        const value = data[data.length-1].y;
		//console.log(`Value ${value}`)
		
        if(showLast){
			if (showLast < data.length )
            	series.data = data.slice( -1*(showLast) );
		}
		return (
			<>
				<div className="col-3 mt-5 d-flex justify-content-center">
					<Gauge
						label={label}
						value={value}
						start={min}
						end={max}
						height={450}
						formatter={formatter}
					></Gauge>
				</div>
				<div
					className="col-8 w-90 mt-5 d-flex justify-content-center"
					style={{ background: "rgba(0,0,0,0.5)" }}
				>
					<MyResponsiveLine data={[series]} xLabel={xLabel} yLabel={yLabel} />
				</div>
			</>
		);
	}
}

PlotWithGauge.propTypes = {
	label: PropTypes.string,
	formatter: PropTypes.func.isRequired,
	yLabel: PropTypes.string,
	xLabel: PropTypes.string,
	series: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			color: PropTypes.string,
			data: PropTypes.arrayOf(
				PropTypes.shape({
					x: PropTypes.number,
					y: PropTypes.number,
				})
			),
		})
	).isRequired,
	gaugeLimits: PropTypes.shape({
		min: PropTypes.number,
		max: PropTypes.number,
	}).isRequired,
	showLast : PropTypes.number,
};
export default PlotWithGauge;