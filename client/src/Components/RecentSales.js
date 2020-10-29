import React, {useContext} from "react";
import "../App.css";
import {userInfoContext} from '../userInfoContext';


const RecentSales = (props) => {
    const {expenseList} = useContext(userInfoContext);

    const sales = expenseList.map(
        (d,i) => {
            let fees = parseInt(d.shipping)+parseInt(d.paypal_fee)+parseInt(d.seller_fee);
            //console.log(parseInt(d.shipping)+parseInt(d.paypal_fee)+parseInt(d.seller_fee));
            if(i >= expenseList.length-5){
                return (
                    <div className="Expense" key={i}>
                        <p>Sold at ${d.sold}</p>
                        <p>Fees: {fees}</p>
                        <hr />
                        <h3>${d.item_profit}</h3>
                    </div>
                );
            }
        }
        );
    return(
        <div className="GridItem1">
            <h2>Recent Sales</h2>
            <div className="CardLayout">
                {sales}
            </div>
            
        </div>

    );
};

export default RecentSales;