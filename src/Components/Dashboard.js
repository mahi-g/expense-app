import React from 'react';

import Chart from "./Chart";
import Calculations from "./Calculations";
import {drawBarChart} from "../charts/drawBarChart"
import Forms from "./Forms";
import RecentSales from "./RecentSales";

import sortList from "../pureFunctions/sorting.js";

const Dashboard = (props) => {
        return(
            <div className="GridItem2">
                <Chart />
                <RecentSales list={props.state.list}/>
                        
                    <h2>Calculate Expense</h2>
                    <div>
                        <div className="Card">
                            <Forms handleFormInputs={props.handleFormInputs}/>
                        </div>
                        <div className="Card View">
                            <Calculations data={props.state}/> 
                        </div>
                    </div>
            
                    <h2>Revenue</h2>
                    <div className="Card">
                        <select id="Graph">
                        <option>Current Month</option>
                        <option>Past 6 Month</option>
                        </select>
                        <Charts data={props.state.list}/>
                    </div>
            </div>
        );
            
    
};

class Charts extends React.Component {   
    componentDidMount() {
        drawBarChart(this.props.data);


    }
    componentDidUpdate(){
        drawBarChart(this.props.data);
        sortList.sortByDate(this.props.data);

        
    }

    render(){
        return (
            <div id="charts" />          
        );
    }
};


export default Dashboard;