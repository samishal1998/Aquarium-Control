import React from 'react';
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";

export class Gauge extends React.Component {
  constructor(props) {
    super(props);
      const {label,value,start,end,formatter,height} = props;
      const percent = 100*value/(end-start);
    this.state = {

      series: [percent],
      options: {
        chart: {
          height: height ?? 350,
          type: 'radialBar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: '70%',
              background: 'rgba(0,0,0,0.75)',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: 'rgba(200,200,200,0.5)',
              strokeWidth: '67%',
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },

            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: '#AAA',
                fontSize: '17px'
              },
              value: {
                formatter: (val)=>formatter(val,(0.01*val*(end-start)).toFixed(2),start,end),
                color: '#fff',
                fontSize: '36px',
                show: true
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: [label]
      }
    };
  }

  render() {
    const {label,value,start,end,formatter,height} = this.props; 
    let percent = 100*value/(end-start);
    if(value > end) percent = 100;
    return (
      

      <div id="card">
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={[percent]}
            type="radialBar"
            height={350}/>
        </div>
      </div>
    );
  }
}