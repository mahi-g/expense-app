import React, { useContext, useEffect } from 'react';
import axiosApiInstance from './api/axios';
import { userInfoContext } from './userInfoContext';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
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
        }).catch( async err => {
            if(!err){
                await axiosApiInstance.get('/expenses')
                .then( response => {
                    console.log(response);
                    this.context.setExpense(response.data.expenses);
                });
            }
        });

       
    }

   
    async componentDidMount() {
        //check if accesstoken exists / is not null
        const accessTokenExists = localStorage.getItem('accessToken') !== null;

        console.log("accessTokenExists", accessTokenExists);

        if(accessTokenExists) {
            //if there is an accessToken, send a get request to retrieve expense data and add it to the user context api
            await axiosApiInstance.get('/expenses')
                .then( res => {
                    if (res !== undefined) {
                        this.context.setExpense(res.data.expenses);
                        this.context.setAuth(true);
                        this.context.setUser(localStorage.getItem('username'));
                    }
            //if a 403 error is returned, current access token is expired and a new access token is 
            //generated and the get request is called again inside the axios response interceptor    
            }).catch( error => console.log("Error from expense", error));
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
                <RefreshToken />
            </Router>
        );
    }
}

const RefreshToken = () => {
    const { setUser, setExpense, setAuth, currentUser, isAuthenticated } = useContext(userInfoContext);

    axiosApiInstance.interceptors.response.use(res => res, async err => {

        //cookie has expired, redirect to login page
        // if(err.response.status === 401){ 
        //     const history = useHistory();
        //     history.push('/login');
        // };

    
        console.log(err.response);
        //accessToken is expired, refresh the token
        if(err.response.status === 403){
             
            await axiosApiInstance.post('/refresh-token', {}, {withCredentials:true}).then(
                //store the new accessToken in localStorage
                res => {
                    console.log(res);
                    localStorage.removeItem('accessToken');
                    localStorage.setItem('accessToken', res.data.accessToken);
                }
            );
            //attach the new accessToken into the header and retry the failed request
            err.config.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
            retryRequest(err.config);
        }
    });


    const retryRequest = (originalRequest) => {
        //retry the old request that returned the 403 error
        axiosApiInstance.request(originalRequest).then(res => {
            console.log("response from retry");
            console.log(res);
            //if request is get, then save the expense data in the response to the user context api
            if(originalRequest.method === 'get') {
                setExpense(res.data.expenses);
                //check if currentUser and isAuthenticated have default value (this happens when user session is still persistent 
                //but user exits the browser thus removing data from the user context api)
                //this condition is checked when componentDidMount runs, the get expense request fails, a new access token is created
                //and the get request is reran
                if(currentUser === "" || !isAuthenticated){
                    setAuth(true);
                    setUser(localStorage.getItem('username'));
                }
            }
            //if request is post, make a get request using the same url and save the response to the user context api
            if(originalRequest.method === 'post' || originalRequest.method === 'delete') {
                axiosApiInstance.get(originalRequest.url).then((res => setExpense(res.data.expenses)));
            }
        });
    }

    return(
        <div></div>
    )
}

export default App;


