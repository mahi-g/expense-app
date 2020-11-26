import React, { useContext } from 'react';
import { userInfoContext } from '../userInfoContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import sales from '../sales.svg'

const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

const TotalRevenue = () => {
    const classes = useStyles();
    const { expenseList } = useContext(userInfoContext);
    let revenue = 0;
    expenseList.forEach( sale => {
        revenue += parseInt(sale.sold);
    })
    return (
        <Card className={classes.header}>
            <img src={sales} alt="bag icon" style={{width:'50px', height:'50px', display:'block', margin:'auto', marginLeft:'10px'}} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {revenue}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Total Revenue
                </Typography>
            </CardContent>
        </Card>
    );
}

export default TotalRevenue;