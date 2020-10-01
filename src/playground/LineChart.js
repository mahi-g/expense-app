import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const LineChart = (props) => {
    
    sortByDate(props.data, props.selectedValue);

    let startMonth;
    let startYear;
    const currDate = new Date();
    const endMonth = parseInt(currDate.getMonth());
    const endYear = parseInt(currDate.getFullYear());
    if(props.selectedValue === "six-month"){
        if(endMonth >= 5){
            //5 is the 6th month
            startMonth = endMonth-5; 
            startYear = endYear;
        }
        else{
            startMonth = 12+endMonth-5;
            startYear = endYear-1;
        } 
    }

    startMonth++; //date initializer starts at 1 instead of 0
    const startDate = new Date(startYear+"-"+startMonth);

    let depopExpenses = getExpensesByPlatform(props.data,"Depop", startDate);
    let etsyExpenses =  getExpensesByPlatform(props.data,"Etsy", startDate);
    let ebayExpenses =  getExpensesByPlatform(props.data,"Ebay", startDate);

    console.log(depopExpenses);
    
    let depopSales = getNumberOfSales(depopExpenses, startMonth, startYear);
    let etsySales = getNumberOfSales(etsyExpenses, startMonth, startYear);
    let ebaySales = getNumberOfSales(ebayExpenses, startMonth, );

    console.log(depopSales);
    console.log(etsySales);


    let depopData = getLineChartData(depopSales, startYear, endYear);
    let etsyData = getLineChartData(etsySales, startYear, endYear);
    let ebayData = getLineChartData(ebaySales, startYear, endYear);

    console.log(depopData);
    // console.log(etsyData);
    // console.log(ebayData);

    // let depopArray = [];
    // depopExpenses.forEach((element)=>{
    //     console.log(new Date(element.date));
    //     console.log(new Date(startYear+"-"+startMonth));
    //     console.log()
    //     const [y,m,d]= element.date.split("-");
    //     console.log(y+"-"+m);
    //     console.log(startYear+"-"+startMonth+","+year+"-"+month);
    //     if((y>=startYear && y<=year) && ((parseInt(m))>=startMonth && (parseInt(m))<=month)){
    //         depopArray.push(element);
    //     }
    // });

    const items =[{
        name: "Depop",
        data: depopData
        },
        {
            name: "etsyData",
            data: etsyData
        }
    
    // {
    //     name: "Depop",
    //     data: [
    //         [Date.UTC(2019, 11, 1), 15],
    //         [Date.UTC(2020, 0, 1), 80],
    //         [Date.UTC(2020, 1, 1), 0],
    //         [Date.UTC(2020, 2, 1), 29.9],
    //         [Date.UTC(2020, 3, 1), 71.5],
    //         [Date.UTC(2020, 4, 1), 106.4],
    //         [Date.UTC(2020, 5, 1), 200]
    //     ]
    // }
];


    const options = {        
            title: {
                text: "Title:"+props.selectedValue
            },
        
            // yAxis: {
            //     title: {
            //         text: 'Number of Employees'
            //     }
            // },
            
            xAxis:{
                type: 'datetime'
            },
           
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                }
            },
        
            // series: [{
            //     name: 'Ebay',
            //     data: [43934, 52503, -57177, 69658, 97031, 119931, 137133, 154175]
            // }, {
            //     name: 'Etsy',
            //     data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            // }, {
            //     name: 'Depop',
            //     data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            // }],

            series: items,
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }       
    }
    return(
        <div>
            <div>
                <HighchartsReact 
                    highcharts={Highcharts} 
                    options={options}
                    oneToOne={true}
                />
            </div>
        </div>

    );
}
function sortByDate(list, select){
    list.sort((a,b)=>new Date(a.date)-new Date(b.date));
    return list;

}


//filter expenses by platform, then by date range 
//returns an object
const getExpensesByPlatform = (expenses, platformName, startDate) => {
    return expenses.filter( expense => expense.platform===platformName).filter(
        expense => new Date(expense.date)>= startDate && new Date(expense.date) <= new Date()
    );
}


const getNumberOfSales = (expenses, startMonth, year) =>{
    let obj = {};
    for(let i = 0; i < 6; i++){
        if(startMonth > 12){
            startMonth = 1;
            year++;
            obj[startMonth+"-"+year] = 0;
        }
        else{
            obj[startMonth+"-"+year] = 0;
        }
        startMonth++;
    }

    expenses.forEach((expense) => {
        let month = parseInt(new Date(expense.date).getMonth())+1;
        let year = parseInt(new Date(expense.date).getFullYear());

        obj[month+"-"+year] += 1;
    });

    return obj;
}

const getLineChartData = (expenses, startYear, endYear) => {
    let data = [];
    let date;
    for( const [date, sales] of Object.entries(expenses)){
        const [month, year] = date.split("-");
        data.push([Date.UTC(year, month, 1), sales]);
    }
    return data;
}


export default LineChart;