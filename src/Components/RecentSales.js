import React from "react";
import "../App.css";
const RecentSales = (props) => {
    const sales = props.list.map(
        (d,i)=>{
            let fees = Math.floor((parseInt(d.shippingFee)+parseInt(d.paypalFee)+parseInt(d.sold*0.1))*100) / 100;
            if(i >= props.list.length-5){
                return (
                    <div className="Expense" key={i}>
                        <p>Sold at ${d.sold}</p>
                        <p>Fees: {fees}</p>
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