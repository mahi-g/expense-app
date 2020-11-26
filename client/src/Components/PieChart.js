import React, {useContext} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import sortList from "../pureFunctions/sorting.js";
import {userInfoContext} from '../userInfoContext';



const PieChart = () => {
    const {expenseList} = useContext(userInfoContext);
    console.log(expenseList);
    console.log("In piechart");
    let data = sortList.getAllRevenue(expenseList);
    console.log(data);
    // Create the chart
    const options = {
        chart: {
            type: 'pie',
            width: 225,
            height: 200
        },
        
        title: {
            text: undefined
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
            pie:{
                //size: '70%',
                innerSize: '60%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            },
            legend: {
                //labelFormat: '{point.name}: {point.y:.1f}%',
                itemStyle: {
                    fontFamily: 'monospace',
                    color: "#9d9ab3",
                    fontSize: '12px'
                }
            },
            series: {
                dataLabels: {
                    enabled: false,
                    format: '{point.name}: {point.y:.1f}%'                    
                }
            }
        },
        
        series: [
            {
                name: "Platforms",
                colorByPoint: true,
                data: [
                    {
                        name: "Ebay",
                        color: '#4b54a5',
                        y: data[0],
                        drilldown: "Ebay"
                    },
                    {
                        name: "Depop",
                        color: '#f596a5',
                        y: data[1],
                        drilldown: "Depop"
                    },
                    {
                        name: "Etsy",
                        color: '#5e86f4',
                        y: data[2],
                        drilldown: "Etsy"
                    },
                ]
            }
        ],  
        credits: {
            enabled: false
          }, 
    };
    return(
        <HighchartsReact
        highcharts={Highcharts}
        options={options}
        oneToOne={true}
        />
    );
}


export default PieChart;
