import React from "react";
import "../App.css";
const RecentSales = (props) => {
    return(
        <div class="GridItem1">
            <h2>Recent Sales</h2>
            <div class="CardLayout">
                {props.list.map((d,i)=>{
                    if(i >= props.list.length-5){
                        return (
                            <div className="Expense">
                                <p>Sold at ${d.sold}</p>
                                <p>Fees: {d.shippingFee+d.paypalFee}</p>
                                
                                <hr />
                                <h3>${d.itemProfit}</h3>

                            </div>
                        );
                    }
                    
                })}
            </div>
            
        </div>

    );
};

export default RecentSales;