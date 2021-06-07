import React from 'react';
import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export default class MyResponsiveLine extends React.Component{
    render(){ 
        const {data,xLabel,yLabel} = this.props;
    return ( <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 30, bottom: 75, left: 70 }}
        // xScale={{ type: 'linear' }}
        yScale={{ type: 'linear', stacked: true, /*min: 0,  max: 2500 */ }}
        yFormat=" >-.2f"
        curve="monotoneX"
        theme = {{
            textColor :  '#FFF',
            fontSize: '14px',
            axis :{
                domain :{
                    line :{
                        "stroke": "rgba(255,255,255,.5)",
                        strokeWidth :5,
                    },
                },
                legend:{
                    text: {
                        fontSize: '22px',
                        fill:"rgba(255,255,255,.5)",
                    },
                    
                },
                ticks:{
                    text: {
                        fontSize: '16px',
                        fill:"rgba(255,255,255,.5)",
                    },
                    
                },
            },
            "grid": {
                "line": {
                    "stroke": "rgba(255,255,255,.5)",
                    "strokeWidth": 1,
                }
            }
        }}
        axisTop={null}

        axisBottom={{
   
            tickValues : 10,
            tickSize: 5,
            tickPadding: 15,
            tickRotation: 0,
            // format: '.2f',
            // format:(val)=>parseInt(val),
            legend: xLabel,
            legendOffset: 60,
            legendPosition: 'middle',
            symbolSize: 25,
        }}
        
        axisLeft={{
            tickValues : 5,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2s',
            legend: yLabel,
            legendOffset: -60,
            legendPosition: 'middle'
        }}
        colors={'rgba(20,80,180)'}
        // colors={{ scheme: 'green_blue' }}
        lineWidth={4}

        pointSize={10}
        pointColor="rgba(0,0,0,0.5)"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        animate={false}
        enableArea={true}
        areaOpacity={0.4}
        useMesh={true}
        // gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
        // gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
        // legends={[
        //     {
        //         anchor: 'bottom-right',
        //         direction: 'column',
        //         justify: false,
        //         translateX: 140,
        //         translateY: 0,
        //         itemsSpacing: 2,
        //         itemDirection: 'left-to-right',
        //         itemWidth: 80,
        //         itemHeight: 12,
        //         itemOpacity: 0.75,
        //         symbolSize: 12,
        //         symbolShape: 'circle',
        //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
        //         effects: [
        //             {
        //                 on: 'hover',
        //                 style: {
        //                     itemBackground: 'rgba(0, 0, 0, .03)',
        //                     itemOpacity: 1
        //                 }
        //             }
        //         ]
        //     }
        // ]}
    />
);
}
}
