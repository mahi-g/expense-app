import React from "react";
import {
    Link
} from 'react-router-dom';



const Sidebar = () => {
    return(
        <div className="Sidebar">
            <h3>Hi Mahi</h3>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/track">Track Packages</Link></li>
                <li><Link to="/expenses">Expenses</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;