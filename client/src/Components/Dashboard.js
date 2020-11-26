import React, {useState} from 'react';

import LineChart from "./LineChart";
import Calculator from "./Calculator";
import PieChart from "./PieChart";
import RecentSales from "./RecentSales";
import TotalSales from "./TotalSales";
import TotalRevenue from "./TotalRevenue";
import TopSellingPlatform from "./TopSellingPlatform";
import ActiveOrders from "./ActiveOrders";

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },  
    button:{
        height: '20%',
        margin: 'auto',
        marginRight: '0'
    }
});

const Dashboard = (props) => {
    const [selectedDateValue, setValue] = useState("six-month");
    const classes = useStyles();
    return (
        <div className="GridItem2">
        
        <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12} className={classes.header}>
                <h2>DASHBOARD</h2>
                <Button>Add Sale</Button>
            </Grid>

            <Grid item xs={6} md={3} lg={3}>
                <TotalSales/>
            </Grid>
            <Grid item xs={6} md={3} lg={3}>
                <TotalRevenue/>
            </Grid>
            <Grid item xs={6} md={3} lg={3}>
                <TopSellingPlatform/>
            </Grid>
            <Grid item xs={6} md={3} lg={3}>
                <ActiveOrders/>
            </Grid>
           
            <Grid item xs={12} md={6} lg={6}>
                <Card>
                    <CardContent className={classes.header}>
                        <h3>Sales</h3>
                        <ButtonGroup size="small" aria-label="small outlined button group" className={classes.button}>
                            <Button onClick={()=>setValue('week')} >Week</Button>
                            <Button onClick={()=>setValue('current-month')} >Month</Button>
                            <Button onClick={()=>setValue('six-month')} >Year</Button>
                        </ButtonGroup>
                    </CardContent>
                    <LineChart selectedDateValue={selectedDateValue} />
                </Card>
            </Grid>
           
            <Grid item xs={12} md={6} lg={3}>
                <Card>
                    <CardContent className={classes.header}>
                        <h3>Revenue</h3>
                    </CardContent>
                    <PieChart/>
                </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <RecentSales/>
            </Grid>
        </Grid>
    </div>
    );
};



export default Dashboard;
