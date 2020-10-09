import React, {useState} from 'react';

import LineChart from "./LineChart";
import PieChart from "./PieChart";
import Calculations from "./Calculations";
import {drawBarChart} from "../charts/drawBarChart"
import Forms from "./Forms";
import RecentSales from "./RecentSales";


const Dashboard = (props) => {
    const [selectedValue, setValue] = useState("current-month");
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
                <LineChart selectedValue={selectedValue} data={props.state.list} />
            </div>

            {
            //<div className="Card">
            //     <select id="Graph">
            //         <option>Current Month</option>
            //         <option>Past 6 Month</option>
            //     </select>
            //     <PieChart data={props.state.list}/>
            //</div>
            }

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
        </div>
    );

};



export default Dashboard;
