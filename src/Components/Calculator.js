import React from 'react';
import "../App.css"

import {drawBarChart} from "../D3Charts/drawBarChart"
import calculateFees from "./mathFunctions";
import Calculations from "./Calculations";
import Forms from "./Forms";
import ItemTableContents from "./ItemTableContents";
import ItemTableHeaders from "./ItemTableHeaders";

//All strings that will be changed sparingly/not at all should be established beforehand..
const resultTableHeaders = ["Sold", "Paid", "Quantity", "Shipping", "Other", "Paypal Fee", "Seller Fee", "Profit", "Platform", "Date"];

export default class Calculator extends React.Component {
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
        const form = {};
        for(let i = 0; i < target.length; i++){
            form[target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
        const paypalFee = calculateFees.getPaypalFee(form.sold);
        const sellerFee = calculateFees.getSellerFee(form.platform, form.sold)
        const balance =  calculateFees.getBalance(form.sold,paypalFee,sellerFee,form.shipping,form.other);
        const itemProfit = calculateFees.getProfit(balance, form.paid);

        console.log("current", this.state);
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
        console.log("previous state", prevState);
        const json = JSON.stringify(this.state);
        console.log("Updated:", this.state);
        localStorage.setItem('fooooooooo', json);
        console.log("Updated");
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
        console.log("did mount");
        console.log("mount current", this.state);
    }

    render() {
        const display = this.state.list;
        console.log("This is ", display);
        return (
            <div>
                <Forms handleFormInputs={this.handleFormInputs}/>
                <Calculations className="Cardstyle" data={this.state}/>

                <h4>All Expenses</h4>
                {this.state.list.length === 0 && (<p>Add an expense to get started</p>)}
                <table className="TableS">
                    <ItemTableHeaders headers={resultTableHeaders} listCount={this.state.list.length}/>
                    <ItemTableContents list={this.state.list}/>
                </table>
                <h4>Your net profit: {this.state.netProfit}</h4>

                <Charts data={this.state.list}/>
            </div>
        )
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
            <div id="charts"/>
        );
    }
};


export {Calculator};

