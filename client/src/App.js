import React from 'react';
import API from './api/api';
import "./App.css";

import {
    BrowserRouter as Router,
} from 'react-router-dom';

import calculateFees from "./pureFunctions/calculateFees";
import Routes from "./routes/routes.js";
import Sidebar from "./Components/Sidebar.js";

const userid = 'mahi1234';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            balance: 0,
            item_profit: 0,
            paypal_fee: 0,
            seller_fee: 0,
            shipping: 0,
            netProfit: 0,
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
    }
    
    //Deletes selected expense, fetch updated expense list and updates state
    async handleDeleteOption(e){
        e.preventDefault();
        const transaction_id = e.target.value;
        await API.delete(`/expenses/${userid}/${transaction_id}`);
        await API.get('/expenses/${userid}')
            .then( response => {
            this.setState({list:response.data.data.id});
        });
    }

    //Calculates fees from user expense inputs
    //Sends post request to add new expense to db
    //Fetches updated list and updates state
    async handleFormInputs(event) {
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

        //post form inputs, and calculated fee to the database
        await API.post(`/expenses/${userid}`, {
            paid:form.paid,
            sold:form.sold,
            shipping: form.shipping,
            other:form.other,
            paypal_fee,
            seller_fee,
            item_profit,
            platform:form.platform,
            date: form.date
        })

        await API.get(`/expenses/${userid}`)
            .then( response => {
            this.setState({list:response.data.data.id});
        });
    }

    async componentDidMount() {
        try{
            await API.get(`/expenses/${userid}`)
                .then( response => {
                    console.log(response.data);
                    this.setState({list:response.data.data.id});
            });
        }
        catch(err){
            console.log(err);
        }
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


