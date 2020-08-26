import React from "react";
import "../App.css";
const RecentSales = (props) => {
    const sales = props.list.map(
        (d,i)=>{
            if(i >= props.list.length-5){
                return (
                    <div className="Expense" key={i}>
                        <p>Sold at ${d.sold}</p>
                        <p>Fees: {d.shippingFee+d.paypalFee}</p>
                        <hr />
                        <h3>${d.itemProfit}</h3>
                    </div>
                );
            }
            
        });
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