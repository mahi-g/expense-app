import React from 'react';
import "../App.css"

const Calculations = (props) => {
    return (
        <div className="Cardstyle">
            <p>PayPal Fee: <b>${props.data.paypalFee}</b></p>
            <p>Seller Fee: <b>${props.data.sellerFee}</b></p>
            <p>Shipping: <b>${props.data.shippingFee}</b></p>
            <p>Revenue: <b>${props.data.balance}</b></p>
            <p>Your profit: <b>${props.data.itemProfit}</b></p>
        </div>
    );
};



export default Calculations;