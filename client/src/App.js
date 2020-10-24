import React from 'react';
import API from './api/api';
import "./App.css";
import {userInfoContext} from './userInfoContext';
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
        const g = { authorization: "Bearer "+this.context.tokens.accessToken};

        const transaction_id = e.target.value;
        await API.delete(`/expenses/${transaction_id}`, { headers:g });
        await API.get('/expenses', {headers: g})
                .then( response => {
                console.log(response);
                this.context.setExpense(response.data.expenses);
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
        console.log("HandlefprmInputs:");
        console.log(this.context.tokens.accessToken);
        const g = { authorization: "Bearer "+this.context.tokens.accessToken};
        console.log(g);
        await API.post('/expenses', {
            paid:form.paid,
            sold:form.sold,
            shipping: form.shipping,
            other:form.other,
            paypal_fee,
            seller_fee,
            item_profit,
            platform:form.platform,
            date: form.date
        },{headers:g});

        await API.get('/expenses', {headers: g})
        .then( response => {
            console.log(response);
            this.context.setExpense(response.data.expenses);
        });
    }

    // async componentDidMount() {
    //     try{
    //         console.log("In componentdidmount",this.context.currentUser);

    //         if(this.context.currentUser !== ""){
    //             console.log("In IF",this.context.currentUser);

                
    //             await API.get(`/expenses`, this.createHeader)
    //                 .then( response => {
    //                     console.log(response.data);
    //                     this.setState({list:response.data.data.id});
    //             });
    //         }
            
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }

    componentDidMount(){
        console.log("APP JS Component Did Mount");
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


