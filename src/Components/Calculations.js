import React from 'react';
import "../App.css"
const Calculations = (props) => {
    return (
        <div className="Cardstyle">
            <p>PayPal: {props.data.paypalFee}</p>
            <p>Seller Fee: {props.data.sellerFee}</p>
            <p>Estimated Shipping: {props.data.shippingFee}</p>
            <p>Money you keep: {props.data.balance}</p>
            <p><b>Your profit:{props.data.itemProfit}</b></p>
        </div>
    );
};


export default Calculations;