import React, {useContext} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {userInfoContext} from '../userInfoContext';

const LineChart = (props) => {
    const {expenseList} = useContext(userInfoContext);
    sortByDate(expenseList);

    let depopData;
    let etsyData;
    let ebayData;

    let items;
    const currDate = new Date();
    const endMonth = currDate.getMonth();
    const endYear = currDate.getFullYear();
    let title = "Current Month";

    if(props.selectedDateValue === "six-month"){
        title = "Six Months";
        let startMonth;
        let startYear;
        if(endMonth >= 5){
            //5 is the 6th month
            startMonth = endMonth-5; 
            startYear = endYear;
        }
        else{
            startMonth = 12+endMonth-5;
            startYear = endYear-1;
        } 

        //date initializer starts at 1 instead of 0
        startMonth++; 
        const startDate = new Date(startYear+"-"+startMonth);

        //filters the expenses by platform and date
        //counts the numebr of sales
        //converts the object to 2-d array
        depopData = getLineChartData(
            getNumberOfSales(
                getExpensesByPlatform(expenseList,"Depop", startDate),
                startMonth, startYear),
            startYear, endYear
        );

        etsyData = getLineChartData(
            getNumberOfSales(
                getExpensesByPlatform(expenseList,"Etsy", startDate),
                startMonth, startYear),
            startYear, endYear
        );

        ebayData = getLineChartData(
            getNumberOfSales(
                getExpensesByPlatform(expenseList,"Ebay", startDate),
                startMonth, startYear),
            startYear, endYear
        );
        items = [
            {
                name: "Depop",
                data: depopData
            },
            {
                name: "Etsy",
                data: etsyData
            },
            {
                name: "Ebay",
                data: ebayData
            }
        ];
        
    }
    else{
        let day = currDate.getDate();
        let month = currDate.getMonth()-1;
        let year = currDate.getFullYear();
        if(month < 0){
            month = 11;
            year--;
        }
     
        items = [{
            name: "Depop",
            fillColor: {
                linearGradient: [0, 0, 0, 100],
                stops: [
                    [0, "#f596a5"],
                    [1, Highcharts.color("#f596a5").setOpacity(0).get('rgba')]
                ]
            },
            data:  getSalesForMonth(
                    getExpensesByPlatform(expenseList,"Depop", new Date(year,month,day)), 
                    year, month, day
            ),
            pointStart: Date.UTC(year, month, day),
            pointInterval: 24 * 3600 * 1000 // one day
        },
        {
            name: "Etsy",
            fillColor: {
                linearGradient: [0, 0, 0, 100],
                stops: [
                    [0, "#feb974"],
                    [1, Highcharts.color("#feb974").setOpacity(0).get('rgba')]
                ]
            },
            data:  getSalesForMonth(
                    getExpensesByPlatform(expenseList,"Etsy", new Date(year,month,day)), 
                    year, month, day
            ),
            pointStart: Date.UTC(year, month, day),
            pointInterval: 24 * 3600 * 1000 // one day
        },
        {
            name: "Ebay",
            fillColor: {
                linearGradient: [0, 0, 0, 100],
                stops: [
                    [0, "#4b54a5"],
                    [1, Highcharts.color("#4b54a5").setOpacity(0).get('rgba')]
                ]
            },
            data:  getSalesForMonth(
                    getExpensesByPlatform(expenseList,"Ebay", new Date(year,month,day)), 
                    year, month, day
            ),
            pointStart: Date.UTC(year, month, day),
            pointInterval: 24 * 3600 * 1000 // one day
        }
        ];
    }
    

    const options = { 
            colors:["#f596a5","#feb974","#4b54a5","#5e86f4"],
            chart: {
                type: 'areaspline',
                height: 200,
                margin: [10, 50, 60, 50],
                style: {
                    color: "#9d9ab3",
                }
            },       
            title: {
                text: undefined            
            },

            yAxis: {
                gridLineDashStyle: 'dash',
                title: {
                    text: undefined
                },
                labels: {
                    style: {
                        color: "#9d9ab3",
                    }
                }     
            },
            
            xAxis:{
                type: 'datetime',
                dateTimeLabelFormats:{
                    month: '%b' 
                },
                labels: {
                    style: {
                        color: "#9d9ab3",
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontFamily: 'monospace',
                    color: "#9d9ab3",
                    fontSize: '12px'
                }
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    marker: {
                        enabled: false
                    }
                }
            },

            series: items,
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 400,
                        height: "100%"
                    },
                    chart:{
                        height: "100%"
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'middle',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
              }  
    }

    return(
        <>
                <HighchartsReact 
                    highcharts={Highcharts} 
                    options={options}
                    oneToOne={true}
                />
        </>

    );
}



//Sorts the expense list by 
const sortByDate = (expenses) => {
    return expenses.sort((a,b)=>new Date(a.date)-new Date(b.date));
}


//Filters expenses by platform, then by date range 
//Return value is an object
const getExpensesByPlatform = (expenses, platformName, startDate) => {
    return expenses.filter( expense => expense.platform===platformName).filter(
        expense => new Date(expense.date)>= startDate && new Date(expense.date) <= new Date()
    );
}


//Creates an object with the given month/year range as key and initializes the number of sales as 0
//Counts the number of sales for each occuring month, then adds it to the object key
const getNumberOfSales = (expenses, startMonth, startYear) => {
    let numSalesObj = {};
    let month;
    let year;
    for(let i = 0; i < 6; i++){
        if(startMonth > 11){
            startMonth = 1;
            startYear++;
            numSalesObj[startMonth+"-"+startYear] = 0;
        }
        else {
            numSalesObj[startMonth+"-"+startYear] = 0;
        }
        startMonth++;
    }

    expenses.forEach((expense) => {
        month = parseInt(new Date(expense.date).getMonth()+1);
        year = new Date(expense.date).getFullYear();
        numSalesObj[month+"-"+year] += 1 || 0;
    });
    return numSalesObj;
}

//Takes an expense object with key value pair of date and number of sales
//Returns a 2-d array with dates and number of sales for Highchart
const getLineChartData = (expenses) => {
    let data = [];
    for( const [date, sales] of Object.entries(expenses)){
        let [month, year] = date.split("-");
        month--;
        data.push([Date.UTC(year, month), sales]);
    }
    return data;
}

//Takes an expense object, counts number of sales per day in 30 days
//Returns an array with number of sales for Highchart
const getSalesForMonth = (expenses, year, month, day) => {
    let monthlySales = {};
    let j = 30;
    let count = 0;
    for(let i = day; i <= j; i++){
        let x = (`${year}-${month}-${i}`);
        monthlySales[x] = 0; 
        if(i === j && count < 30 ){ 
            i = 0; 
            j = day; 
            month++;
            if(month === 11){
                month=0;
                year++;
            }
        }
        count++;
    }
    expenses.forEach(expense => {
        const [year, month, day] = expense.date.split("-");
        monthlySales[`${year}-${parseInt(month-1,10)}-${parseInt(day,10)}`] += 1;
    });

    let monthlySumArray = [];
    for(const [date, sales] of Object.entries(monthlySales)){
        monthlySumArray.push(sales);
    };
    return monthlySumArray;
}


export default LineChart;