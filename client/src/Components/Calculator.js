import React from 'react';
import Calculations from "./Calculations";
import Forms from "./Forms";


export default (props) => {
    return(
        <div>
            <div className="Card">
                <Forms handleFormInputs={props.handleFormInputs}/>
            </div>
            <div className="Card View">
                 <Calculations data={props.state}/>
            </div>
        </div>
    );
};

