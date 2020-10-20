import React, {useState} from 'react';

import LineChart from "./LineChart";
import Calculator from "./Calculator";
import PieChart from "./PieChart";
import RecentSales from "./RecentSales";


const Dashboard = (props) => {
    const [selectedDateValue, setValue] = useState("current-month");
    return (
        <div className="GridItem2">
            <h2>Revenue</h2>
            <div className="Card">
                <PieChart data={props.state.list}/>
            </div>
            <div className="Card">
                <select onChange={(e)=>setValue(e.target.value)} id="Graph">
                    <option value="current-month">Current Month</option>
                    <option value="six-month">Past 6 Month</option>
                </select>
                <LineChart selectedDateValue={selectedDateValue} data={props.state.list} />
            </div>
            <RecentSales list={props.state.list}/>
            <h2>Calculate Expense</h2>
            <Calculator
                handleFormInputs = {props.handleFormInputs}
                state = {props.state}
            />
        </div>
    );
};



export default Dashboard;
