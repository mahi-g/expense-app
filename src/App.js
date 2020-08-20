import React from 'react';
import "./App.css";


import {
    BrowserRouter as Router,
} from 'react-router-dom';

import calculateFees from "./pureFunctions/calculateFees";
import Routes from "./routes/routes.js";
import Sidebar from "./Components/Sidebar.js";


class App extends React.Component {
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
            <Router>
                <div className={"App"}>
                    <div className={"Header"}>
                        <Sidebar />
                    </div>
                    <div className={"Body"}>
                        <div className="GridContainer">
                                <Routes state={this.state} handleFormInputs={this.handleFormInputs}/>
                        </div>
                    </div>
                    <div className={"Footer"}>
                        {/*Empty For Now*/}
                    </div>
                </div>
            </Router>
        );
    }
}



export default App;


