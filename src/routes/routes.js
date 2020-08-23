import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';

import Dashboard from "../Components/Dashboard";
import TrackPackages from "../Components/TrackPackages";
import ViewExpenses from "../Components/ViewExpenses";

const Routes = (props) =>{
    return(
            <Switch>
                <Route path="/track"><TrackPackages/></Route>
                <Route path="/expenses"><ViewExpenses
                    expenseList={props.state.list}/>
                </Route>
                <Route path="/"><Dashboard 
                    state={props.state}
                    handleFormInputs={props.handleFormInputs}/>
                </Route>
            </Switch>    
    );
};
                
export default Routes;