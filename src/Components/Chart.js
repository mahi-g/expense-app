import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import sortList from "../pureFunctions/sorting.js";



const Chart = (props) => {
    let data = sortList.getAllRevenue(props.data);
    console.log(data);
    // Create the chart
const options = {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'All time revenue from each platforms'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        },
        point: {
            valueSuffix: '%'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.1f}%'
            }
        }
    },

    series: [
        {
            name: "Browsers",
            colorByPoint: true,
            data: [
                {
                    name: "Ebay",
                    y: data[0],
                    drilldown: "Ebay"
                },
                {
                    name: "Depop",
                    y: data[1],
                    drilldown: "Depop"
                },
                {
                    name: "Etsy",
                    y: data[2],
                    drilldown: "Etsy"
                },
            ]
        }
    ]   
    };
    return(
        <HighchartsReact
        highcharts={Highcharts}
        options={options}
    />
    );
    
}

export default Chart;
