import React, {useContext} from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Dashboard from "../Components/Dashboard";
import Calculator from "../Components/Calculator";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import TrackPackages from "../Components/TrackPackages";
import {userInfoContext} from '../userInfoContext';
import ViewExpenses from "../Components/ViewExpenses";

const RequireAuth = ({children}) => {
    const user = useContext(userInfoContext);
    console.log("currentUser",user.currentUser);
    console.log("Tokens",user.tokens);
    console.log("Expenses",user.expenseList);

    if(user.currentUser==="") {
        return <Redirect to={{pathname:"/login"}}/>
    }
    return children;
}

const Routes = (props) =>{
    return(
            <Switch>
                <Route path="/login">
                    <Login handleLogin = {props.handleLogin}/>
                </Route>
                <Route path="/signup"><Signup/></Route>
                <Route exact path="/">
                    <Calculator
                        handleFormInputs = {props.handleFormInputs}
                        state = {props.state}
                    />
                </Route>
                <RequireAuth>
                    <Route path="/dashboard">
                        <Dashboard 
                            state={props.state}
                            handleFormInputs={props.handleFormInputs}
                        />
                    </Route>
                    <Route path="/track"><TrackPackages/></Route>
                    <Route path="/expenses">
                        <ViewExpenses
                            handleDeleteOption = {props.handleDeleteOption}
                        />
                    </Route>
                </RequireAuth>

                
            </Switch>    
    );
};
                
export default Routes;