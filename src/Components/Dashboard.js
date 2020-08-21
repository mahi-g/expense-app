import React from 'react';


import Calculations from "./Calculations";
import {drawBarChart} from "../charts/drawBarChart"
import Forms from "./Forms";
import RecentSales from "./RecentSales";


export default class Dashboard extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="GridItem2">
                <RecentSales list={this.props.state.list}/>
                        
                    <h2>Calculate Expense</h2>
                    <div>
                        <div className="Card">
                            <Forms handleFormInputs={this.props.handleFormInputs}/>
                        </div>
                        <div className="Card View">
                            <Calculations data={this.props.state}/> 
                        </div>
                    </div>
            
                
                    <h2>Revenue</h2>
                    <div className="Card">
                        <select id="Graph">
                        <option>Current Month</option>
                        <option>Past 6 Month</option>
                        </select>
                        <Charts data={this.props.state.list}/>
                    </div>
            </div>
        );
            
    }
}

class Charts extends React.Component {   
    componentDidMount() {
        drawBarChart(this.props.data);
    }
    componentDidUpdate(){
        drawBarChart(this.props.data);
    }

    render(){
        return (
            <div id="charts" />          
        );
    }
};
