import React from "react";
import "../App.css";
const Sidebar = () => {
    return(
        <div className="Sidebar">
            <h3>Hi Mahi</h3>
            <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Track Package</a></li>
                <li><a href="#">View Expense</a></li>
                <li><a href="#">Account</a></li>
            </ul>
        </div>

    );
};

export default Sidebar;