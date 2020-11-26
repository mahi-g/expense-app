import React, {useContext} from "react";
import "../App.css";
import {userInfoContext} from '../userInfoContext';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    } 
});

const RecentSales = (props) => {
    const {expenseList} = useContext(userInfoContext);
    const classes = useStyles();
    const sales = expenseList.map( (d,i) => {
            if(i >= expenseList.length-4){
                return (
                    <CardContent className={classes.header}>
                        <p>${d.sold}</p>
                        <p>{d.platform}</p>
                        <p>{d.date}</p>
                    </CardContent>
                );
            }
        }
        );
    return(
        <Card>            
            <h3>Recent Sales</h3>
            {sales}
        </Card>
    );
};

export default RecentSales;