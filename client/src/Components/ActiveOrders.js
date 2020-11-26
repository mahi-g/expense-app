import React, { useContext } from 'react';
import { userInfoContext } from '../userInfoContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import box from '../box.svg'


const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-around',
    },
});

const ActiveOrders = () => {
    const classes = useStyles();
    const { expenseList } = useContext(userInfoContext);
    const numSales = expenseList.length;
    return (
        
        <Card className={classes.header}>
            <img src={box} alt="bag icon" style={{width:'50px', height:'50px', display:'block', margin:'auto', marginLeft:'10px'}} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {5}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Active Orders
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ActiveOrders;