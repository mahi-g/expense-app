import React, { useContext } from 'react';
import { userInfoContext } from '../userInfoContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import bag from '../bag.svg'


const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: 'none',
    },
});

const TotalSales = () => {
    const classes = useStyles();
    const { expenseList } = useContext(userInfoContext);
    const numSales = expenseList.length;
    return (
        
        <Card className={classes.header}>
            <img src={bag} alt="bag icon" style={{width:'40px', height:'40px', display:'block', margin:'auto', marginLeft:'10px'}} />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Total Sales
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    {numSales}
                </Typography>
               
            </CardContent>
        </Card>
    );
}

export default TotalSales;