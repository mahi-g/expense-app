import React from 'react';
import API from './api/api';
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
            item_profit: 0,
            paypal_fee: 0,
            seller_fee: 0,
            shippingFee: 0,
            netProfit: 0,
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);

    }
    
    handleDeleteOption(e){
        e.preventDefault();
        const transaction_id = e.target.value;
        const userid = 'mahi1234';
        API.delete(`/expenses/${userid}/${transaction_id}`);
        API.get('/expenses')
            .then( response => {
            const results = response.data;
            this.setState({list:results.data.expenses});
        });
    }

    handleFormInputs(event) {
        event.preventDefault();
        const target = event.target;
        //console.log(event.target.date.value);
        const form = {};
        for(let i = 0; i < target.length; i++){
                form[target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
        const paypal_fee = calculateFees.getPaypalFee(form.sold);
        const seller_fee = calculateFees.getSellerFee(form.platform, form.sold)
        const balance =  calculateFees.getBalance(form.sold,paypal_fee,seller_fee,form.shipping,form.other);
        const item_profit = calculateFees.getProfit(balance, form.paid);

        API.post('/expenses/mahi1234', {
            paid:form.paid,
            sold:form.sold,
            shipping: form.shipping,
            other:form.other,
            paypal_fee,
            seller_fee,
            item_profit,
            platform:form.platform,
            date: form.date
        });

        API.get('/expenses')
            .then( response => {
            const results = response.data;
            this.setState({list:results.data.expenses});
        });
      
        // this.setState((previous) => {
        //         return {
        //             list: previous.list.concat([{
        //                 sold:form.sold,
        //                 paid:form.paid,
        //                 shipping: form.shipping,
        //                 other:form.other,
        //                 paypal_fee,
        //                 seller_fee,
        //                 item_profit,
        //                 platform:form.platform,
        //                 date: form.date
        //             }]),
        //             balance,
        //             item_profit,
        //             paypal_fee,
        //             seller_fee,
        //             shipping: form.shipping,
        //             netProfit: Math.floor((previous.netProfit + item_profit)*100) / 100
        //         }
        //     }
        //);
    }

    componentDidUpdate(prevProps, prevState) {
        // const json = JSON.stringify(this.state);
        // localStorage.setItem('fooooooooooo', json);
        console.log("Component updated");
        console.log(this.state.list);
    }

    async componentDidMount() {
        try{
            await API.get('/expenses')
                .then( response => {
                    const results = response.data;
                    this.setState({list:results.data.expenses});
            });
        }
        catch(err){
            console.log(err);
        }

        console.log(this.state);



        // let data;
        // try {
        //     data = localStorage.getItem('fooooooooooo');
        //     data = JSON.parse(data);
        //     if (data.list) {
        //         this.setState({
        //             list: data.list,
        //             balance: data.balance,
        //             item_profit: data.item_profit,
        //             paypal_fee: data.paypal_fee,
        //             seller_fee: data.seller_fee,
        //             shippingFee: data.shippingFee,
        //             netProfit: data.netProfit
        //         });
        //     }
        // } catch (error) {
        //     data = error.message
        // }

     
       
    }

    render() {
        return (
            <Router>
                <div className={"App"}>
                    <div className={"Body"}>
                        <div className="GridContainer">
                                <Sidebar />
                                <div className="Topbar">
                                    <button>New Expense</button>
                                </div>  
                                <Routes 
                                    state={this.state} 
                                    handleFormInputs={this.handleFormInputs}
                                    handleDeleteOption = {this.handleDeleteOption}
                                />                     
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


