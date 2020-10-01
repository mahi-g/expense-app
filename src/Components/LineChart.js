import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const LineChart = (props) => {
    sortByDate(props.data);

    let startMonth;
    let startYear;
    const currDate = new Date();
    const endMonth = parseInt(currDate.getMonth());
    const endYear = parseInt(currDate.getFullYear());
    let title = "Current Month";
    if(props.selectedValue === "six-month"){
        let title = "Six Months";
        if(endMonth >= 5){
            //5 is the 6th month
            startMonth = endMonth-6; 
            startYear = endYear;
        }
        else{
            startMonth = 12+endMonth-6;
            startYear = endYear-1;
        } 
    }
    

    //date initializer starts at 1 instead of 0
    startMonth++; 
    const startDate = new Date(startYear+"-"+startMonth);

    //filter the expenses by platforms
    let depopExpenses = getExpensesByPlatform(props.data,"Depop", startDate);
    let etsyExpenses =  getExpensesByPlatform(props.data,"Etsy", startDate);
    let ebayExpenses =  getExpensesByPlatform(props.data,"Ebay", startDate);
    
    //get the numbers of sales in an object 
    let depopSales = getNumberOfSales(depopExpenses, startMonth, startYear);
    let etsySales = getNumberOfSales(etsyExpenses, startMonth, startYear);
    let ebaySales = getNumberOfSales(ebayExpenses, startMonth, startYear);

    //convert the object to 2-d array
    let depopData = getLineChartData(depopSales, startYear, endYear);
    let etsyData = getLineChartData(etsySales, startYear, endYear);
    let ebayData = getLineChartData(ebaySales, startYear, endYear);

    const items = [
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
    
    const options = {        
            title: {
                text: "Sales trend:"+title
            },
        
            yAxis: {
                title: {
                    text: 'Number of Sales'
                }
            },
            
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



//Sorts the expense list by 
const sortByDate = (expenses) => {
    expenses.sort((a,b)=>new Date(a.date)-new Date(b.date));
    return expenses;
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
const getNumberOfSales = (expenses, startMonth, startYear) =>{
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
        month = parseInt(new Date(expense.date).getMonth());
        year = new Date(expense.date).getFullYear();
        numSalesObj[month+"-"+year] += 1;
    });

    return numSalesObj;
}

//Takes an expense object with key value pair of date and number of sales
//Returns a 2-d array with dates and number of sales for Highchart
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