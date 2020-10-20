import React from 'react';
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
import ViewExpenses from "../Components/ViewExpenses";

const RequireAuth = ({children}) => {
    const signedIn = false;
    if(!signedIn) {
        return <Redirect to={{pathname:"/login"}}/>
    }
    return children;
}

const Routes = (props) =>{
    return(
            <Switch>
                <Route path="/login"><Login/></Route>
                <Route path="/signup"><Signup/></Route>
                <Route path="/home"><Calculator
                        handleFormInputs = {props.handleFormInputs}
                        state = {props.state}
                    />
                </Route>
                <RequireAuth>
                    <Route path="/track"><TrackPackages/></Route>
                    <Route path="/expenses">
                        <ViewExpenses
                            expenseList={props.state.list}
                            handleDeleteOption = {props.handleDeleteOption}
                        />
                    </Route>
                    <Route path="/">
                        <Dashboard 
                            state={props.state}
                            handleFormInputs={props.handleFormInputs}
                        />
                    </Route>
                </RequireAuth>
            </Switch>    
    );
};
                
export default Routes;