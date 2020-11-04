import React from 'react';
import axiosApiInstance from './api/axios';
import { userInfoContext } from './userInfoContext';
import { BrowserRouter as Router } from 'react-router-dom';
import calculateFees from "./pureFunctions/calculateFees";
import Logout from "./Components/Logout";
import Routes from "./routes/routes.js";
import Sidebar from "./Components/Sidebar.js";
import "./App.css";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            item_profit: 0,
            paypal_fee: 0,
            seller_fee: 0,
            shipping: 0,
            netProfit: 0,
            isLoggedIn: false
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
    }
    static contextType = userInfoContext;

    
    //Deletes selected expense, fetch updated expense list and updates state
    async handleDeleteOption(e){
        e.preventDefault();

        const transaction_id = e.target.value;
        await axiosApiInstance.delete(`/expenses/${transaction_id}`);
        await axiosApiInstance.get('/expenses')
                .then( response => {
                console.log(response);
                this.context.setExpense(response.data.expenses);
            });
    }

    //Calculates fees from user expense inputs
    //Sends post request to add new expense to db
    //Fetches updated list and updates state
    async handleFormInputs(e) {
        e.preventDefault();
        //console.log(event.target.date.value);
        const form = {};
        for(let i = 0; i < e.target.length; i++){
            form[e.target.elements[i].getAttribute("name")] = e.target.elements[i].value;
        }
        const paypal_fee = calculateFees.getPaypalFee(form.sold);
        const seller_fee = calculateFees.getSellerFee(form.platform, form.sold)
        const balance =  calculateFees.getBalance(form.sold,paypal_fee,seller_fee,form.shipping,form.other);
        const item_profit = calculateFees.getProfit(balance, form.paid);

        //post form inputs, and calculated fee to the database
        await axiosApiInstance.post('/expenses', {
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

        await axiosApiInstance.get('/expenses')
        .then( response => {
            console.log(response);
            this.context.setExpense(response.data.expenses);
        });
    }

   
    async componentDidMount() {
        const accessTokenExists = localStorage.getItem('accessToken') !== null;

        console.log("accessTokenExists", accessTokenExists);

        if(accessTokenExists) {
            const x = await axiosApiInstance.get('/expenses')
                .then( response => {
                    this.context.setExpense(response.data.expenses);
                    this.context.setAuth(true);
                    this.context.setUser(localStorage.getItem('username'));
            }).catch( error => console.log("Error from expense",error));

            console.log("x:",x);
        }
    }

    componentDidUpdate(){
        console.log("APP JS Component Did Update");
    }

    render() {
        return (
            <Router>
                <div className={"App"}>
                    <div className={"Body"}>
                        <div className="GridContainer">
                                <Sidebar />
                                <div className="Topbar">
                                   { this.context.isAuthenticated && <Logout/> }
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


