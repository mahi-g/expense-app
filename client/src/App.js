import React, { useContext } from 'react';
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
            deliveryData: [],
            trackingIds: [],
            error: false
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
        this.addTracking = this.addTracking.bind(this);
        this.readData = this.readData.bind(this);
        this.removeTracking = this.removeTracking.bind(this);
    }

    static contextType = userInfoContext;


    //Remove data by making a delete request
    //If only one tracking number exists in the array, then sets the tracking numbers and deliveryData in the state to empty arrays
    //Else, deletes the array, updates the state with the response data, and recalls the readData() function to fetch data from 
    //the api  
    async removeTracking(e) {
        await axiosApiInstance.delete(`tracking/${e.target.value}`).then( response => {
            if(response.data.tracking[0].length === 0) {
                this.setState({deliveryData: []});
                this.context.setTrackingNums([]);
            }
            else {
                this.context.setTrackingNums(response.data.tracking[0].tracking_num);
            }
        }).catch(error=> console.log(error));

        //if state
        if(this.context.trackingNum >= 1) {
            this.readData(this.context.trackingNums);
        }
    }

    //handles tracking number from form input, adds it to database, updates state
    //first checks if input value already exists in trackingNums array
    //then checks if trackingNums is empty or undefined, sends post request to insert trackingNums array into table, 
    //else update existing array with a put request
    //updates trackingNums array in context api
    async addTracking(e){
        e.preventDefault();
        const tracking_num = e.target.track.value;
        if(!this.context.trackingNums.includes(tracking_num)) {
            //check if trackingIds undefined or empty, 
            //if so, send a post request that adds the username and tracking numbers in the db tracking table
            await axiosApiInstance.post(`/tracking/${tracking_num}`).then(
                response => {
                    console.log(response);
                    this.context.setTrackingNums(response.data.data[0].tracking_num);
                }  
            ).catch(error=> console.log(error));
            
            this.readData(this.context.trackingNums);
        }
        else {
            console.log("already exists");
        }
    }

    //Parse xml data for a trackingID
    cleanData(text, trackingId){
        let deliveryDatas = [];
        let detail;
        let summary;

        //Parse text to xml
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(text,"text/xml");
        const error = xmlDoc.getElementsByTagName("Error");
        //Check if shipping API returns error
        if(error[0] !== undefined){
            summary = xmlDoc.getElementsByTagName("Description")[0].textContent;
        } else {
            //Get track summary
            detail = xmlDoc.getElementsByTagName("TrackSummary");
            summary = detail[0].textContent;

            //Get all data inside TrackDetail tags
            //Update state with the data
            detail = xmlDoc.getElementsByTagName("TrackDetail");
            for(const [key, value] of Object.entries(detail)) {
                deliveryDatas.push(value.childNodes[0].nodeValue);
            }
        }
        console.log({trackingId,summary,deliveryDatas});

        this.setState(()=>(
            {
                deliveryData: this.state.deliveryData.concat([{trackingId,summary,deliveryDatas}])
            }
        ));
    }


    async readData(tracking) {
        //reset delivery data to avoid duplication
        this.setState(()=>({deliveryData: []}));

        //Create API url with userID and tracking numbers
        const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML="+
        "<TrackRequest USERID=\"959NA0006949\">"+
        trackingApiCall(tracking)+ 
        "</TrackRequest>";

        await fetch(url)
            .then(response => response.text())
            .then(text => {
                console.log(text);
                //Split text array by </TrackInfo> which puts the data for each tracking number into an array item
                let x = text.split("</TrackInfo>");
                //Iterate through each item in the array
                //Each item and adjacent tracking number is parsed with cleanData() function
                x.map((d,i)=>{
                    if(i !== x.length-1) {
                        this.cleanData(x[i], tracking[i]);
                    }
                })
            })
    }
    
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
            if(response !== undefined){
                this.context.setExpense(response.data.expenses);
            }
            console.log(response);
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

            await axiosApiInstance.get(`/tracking`)
                .then(response => {
                    console.log(response);
                    //response.data.tracking.length<1 ? this.setState({trackingIds: []}) : 
                    //this.setState({trackingIds: response.data.tracking[0].tracking_num})
                    this.context.setTrackingNums(response.data.tracking[0].tracking_num);
                }).catch(error => console.log(error));

            if(this.context.trackingNums.length !== 0){
                this.readData(this.context.trackingNums);
            }          
        }  
    }

    async componentDidUpdate(){
        // if(this.state.trackingIds.length !== ){
        //     await axiosApiInstance.get(`/tracking`).then(
        //         response => {
        //             console.log(response);
        //             //response.data.tracking.length<1 ? this.setState({trackingIds: []}) : 
        //             this.setState({trackingIds: response.data.tracking[0].tracking_num})
        //     }).catch(error => console.log(error));
        //     if(this.state.trackingIds.length !== 0){
        //         this.readData(this.state.trackingIds);
        //     }
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
                                { this.context.isAuthenticated && <Logout/> }
                            </div> 
                            <Routes 
                                state={this.state} 
                                handleFormInputs={this.handleFormInputs}
                                handleDeleteOption = {this.handleDeleteOption}
                                addTracking = {this.addTracking}
                                readData = {this.readData}
                                removeTracking = {this.removeTracking}
                            /> 
                        </div>
                    </div>
                    <div className={"Footer"}>
                        {/*Empty For Now*/}
                    </div>
                </div>
                <RefreshToken stateSetter= {this.stateSetter}/>
            </Router>
        );
    }
}

const RefreshToken = (props) => {
    const { setUser, setExpense, setAuth, setTrackingNums, currentUser, isAuthenticated, trackingNums } = useContext(userInfoContext);
    const history = useHistory();

    axiosApiInstance.interceptors.response.use(res => res, async err => {

        console.log("FIRST",err);

        //cookie has expired or user has logged out from another tab, redirect to login page
        if(err.response.status === 401){ 
            //if refresh token fails, clear local storage
            //for logout event, this is done in logout component
            if(err.config.url === '/refresh-token') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('username');
            }
            setUser("");
            setExpense([]);
            setTrackingNums([]);
            setAuth(false);
            history.push('/login');
        };

        //accessToken is expired, refresh the token
        if(err.response.status === 403){
            let success;
            await axiosApiInstance.post('/refresh-token', {}, {withCredentials:true}).then(
                //store the new accessToken in localStorage
                res => {
                    if(res){
                        success = true;
                        localStorage.removeItem('accessToken');
                        localStorage.setItem('accessToken', res.data.accessToken);
                       
                    }
                }
            );
             //attach the new accessToken into the header and retry the failed request
             if(success){
                err.config.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
                retryRequest(err.config);
             }
            
        }
    });


    const retryRequest = (originalRequest) => {
        //retry the old request that returned the 403 error if it is post or delete
        if(originalRequest.method === 'post' || originalRequest.method === 'delete') {
            axiosApiInstance.request(originalRequest).catch(e=>{
                console.log("Retry request unsuccessful: ", e);
                });
        }
        //if old request is get or post/delete requests above are made succesfully, a get request is made
        //to retrieve the data for expense or tracking
        if(originalRequest.url === '/expenses') {
            axiosApiInstance.get(originalRequest.url).then((res => {
                setExpense(res.data.expenses);
                //check if currentUser and isAuthenticated have default value (this happens when user session is still persistent 
                //but user exits the browser thus removing data from the user context api)
                //this condition is checked when componentDidMount runs, the get expense request fails, a new access token is created
                //and the get request is reran
                if(currentUser === "" || !isAuthenticated){
                    setAuth(true);
                    setUser(localStorage.getItem('username'));
                }
            }));
        } else {
            axiosApiInstance.get('/tracking').then((res => {
                console.log("stateSetter", res);
                res.data.tracking.length !== 0 ? setTrackingNums(res.data.tracking[0].tracking_num) : setTrackingNums([]);
                if(trackingNums.length !== 0){
                    this.readData(trackingNums);
                }
            }));
        }
    }

    return(
        <div></div>
    )
}

function trackingApiCall(trackingNums){
    let trackID = "";
    trackingNums.map((id) => trackID+="<TrackID ID=\"" + id + "\"/>");
    return trackID;
}

export default App;


