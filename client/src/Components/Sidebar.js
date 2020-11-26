import React from "react";
import {
    Link
} from 'react-router-dom';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import IsoIcon from '@material-ui/icons/Iso';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';


const Sidebar = () => {
    return(
        <div className="Sidebar">
            <ul>
                <li><Link to="/dashboard"> <InsertChartIcon/>Dashboard</Link></li>
                <li><Link to="/sales"> <ListAltIcon/>Sales</Link></li>
                <li><Link to="/"> <IsoIcon/>Fee Calculator</Link></li>
                <li><Link to="/track"><LocalShippingIcon/>Track Packages</Link></li>
                <hr />
                <li><Link to="/track"> <AccountCircleIcon/> Profile</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;