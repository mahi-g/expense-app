import React from "react";
import {
    Link
} from 'react-router-dom';



const Sidebar = () => {
    return(
        <div className="Sidebar">
            <h3>Hi Mahi</h3>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/track">Track Packages</Link></li>
                <li><Link to="/expenses">Expenses</Link></li>
                                    {// <li><Link to="/">Account</Link></li> 
                                    }
            </ul>
        </div>
    );
};

export default Sidebar;