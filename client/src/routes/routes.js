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

const PrivateRoutes = ({children}) => {
    const { isAuthenticated } = useContext(userInfoContext);

    if(!isAuthenticated) {
        return <Redirect to={{pathname:"/login"}}/>
    }
    return children;
}
const PublicRoutes = ({children}) => {
    const user = useContext(userInfoContext);
    if(user.isAuthenticated) {
        return <Redirect to={{pathname:"/dashboard"}}/>
    }
    return children;
}


const Routes = (props) => {
    return(
            <Switch>
                    <Route path="/login"><Login/></Route>
                    <Route path="/signup"><Signup/></Route>
                    <Route exact path="/">
                        <Calculator
                            handleFormInputs = {props.handleFormInputs}
                            state = {props.state}
                        />
                    </Route>
                    <PrivateRoutes>
                        <Route path="/dashboard">
                            <Dashboard 
                                state={props.state}
                                handleFormInputs={props.handleFormInputs}
                            />
                        </Route>
                        <Route path="/track">
                            <TrackPackages
                                addTracking = {props.addTracking}
                                readData = {props.readData}
                                removeTracking = {props.removeTracking}
                                state = {props.state}
                            />
                        </Route>
                        <Route path="/sales">
                            <ViewExpenses
                                handleDeleteOption = {props.handleDeleteOption}
                            />
                        </Route>
                    </PrivateRoutes>
            </Switch>    
    );
};

export default Routes;
