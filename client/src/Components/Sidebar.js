import React from "react";
import {
    Link
} from 'react-router-dom';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import IsoIcon from '@material-ui/icons/Iso';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const divLayout = {
    display: 'flex',
}
const LinkText = {
    marginLeft:'25%', 
    marginTop:'2px'
}
const Sidebar = () => {
    return(
        <div className="Sidebar">
            <ul>
                <li>
                    <Link to="/dashboard" style={divLayout}>
                        <div><InsertChartIcon style={{margin:'auto'}} /></div>
                        <div style={LinkText} >Dashboard</div>
                    </Link>
                </li>
                <li>
                    <Link to="/sales" style={divLayout}>
                        <div><ListAltIcon style={{margin:'auto'}} /></div>
                        <div style={LinkText} >Sales</div> 
                    </Link>
                </li>
                <li>
                    <Link to="/" style={divLayout}> 
                        <div><IsoIcon style={{margin:'auto'}} /></div>
                        <div style={LinkText} >Calculator</div>                 
                    </Link>
                </li>
                <li>
                    <Link to="/track" style={divLayout}>
                        <div><LocalShippingIcon style={{margin:'auto'}} /></div>
                        <div style={LinkText} >Track Packages</div>    
                    </Link>
                </li>
                <li>
                    <Link to="/track" style={divLayout}>
                        <div><AccountCircleIcon style={{margin:'auto'}} /></div>
                        <div style={LinkText} >Profile</div> 
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;