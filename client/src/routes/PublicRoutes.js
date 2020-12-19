import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';

import Calculator from "../Components/Calculator";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

const PublicRoutes = (props) => {
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
            </Switch>    
    );
};

export default PublicRoutes;
