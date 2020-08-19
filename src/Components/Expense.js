import React from 'react';
import "../App.css";


import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';


import calculateFees from "./mathFunctions";
import Dashboard from "./Dashboard";
import TrackPackages from "./TrackPackages";
import ViewExpenses from "./ViewExpenses";


class Expense extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            balance: 0,
            itemProfit: 0,
            paypalFee: 0,
            sellerFee: 0,
            shippingFee: 0,
            netProfit: 0,
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
    }

    handleFormInputs(event) {
        event.preventDefault();
        const target = event.target;
        console.log(event.target.date.value);
        const form = {};
        for(let i = 0; i < target.length; i++){
            form[target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
        const paypalFee = calculateFees.getPaypalFee(form.sold);
        const sellerFee = calculateFees.getSellerFee(form.platform, form.sold)
        const balance =  calculateFees.getBalance(form.sold,paypalFee,sellerFee,form.shipping,form.other);
        const itemProfit = calculateFees.getProfit(balance, form.paid);

        this.setState((previous) => {
                return {
                    list: previous.list.concat([{
                        sold:form.sold,
                        paid:form.paid,
                        quantity: 1,
                        shippingFee: form.shipping,
                        other:form.other,
                        paypalFee,
                        sellerFee,
                        itemProfit,
                        platform:form.platform,
                        date:form.date
                    }]),
                    balance,
                    itemProfit,
                    paypalFee,
                    sellerFee,
                    shippingFee: form.shipping,
                    netProfit: Math.floor((previous.netProfit + itemProfit)*100) / 100
                }
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const json = JSON.stringify(this.state);
        localStorage.setItem('fooooooooo', json);
    }

    componentDidMount() {
        let data;
        try {
            data = localStorage.getItem('fooooooooo');
            data = JSON.parse(data);
            console.log("Mount Data:", data);
            if (data.list) {
                this.setState({
                    list: data.list,
                    balance: data.balance,
                    itemProfit: data.itemProfit,
                    paypalFee: data.paypalFee,
                    sellerFee: data.sellerFee,
                    shippingFee: data.shippingFee,
                    netProfit: data.netProfit
                });
            }
        } catch (error) {
            data = error.message
        }
       
    }

    render() {
        return (
                <div className="GridContainer">
                    <Router>
                        
                    <div className="Sidebar">
                        <h3>Hi Mahi</h3>
                        <ul>
                            <li><Link to="/">Dashboard</Link></li>
                            <li><Link to="/track">Track Packages</Link></li>
                            <li><Link to="/expenses">Expenses</Link></li>
                                {// <li><Link to="/">Account</Link></li> 
                                }
                        </ul>
                    </div>
                        
                        <Switch>
                            <Route path="/track"><TrackPackages/></Route>
                            <Route path="/expenses"><ViewExpenses
                                expenseList={this.state.list}
                            /></Route>
                            <Route path="/"><Dashboard 
                                state={this.state}
                                handleFormInputs={this.handleFormInputs}/>
                            </Route>
                        </Switch>
                        
                    </Router>
                </div>
        );
    }
}



export default Expense;

