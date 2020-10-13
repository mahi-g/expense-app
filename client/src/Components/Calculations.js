import React from 'react';
import "../App.css"

const Calculations = (props) => {
    return (
        <div className="Cardstyle">
            <p>PayPal Fee: <b>${props.data.paypal_fee}</b></p>
            <p>Seller Fee: <b>${props.data.seller_fee}</b></p>
            <p>Shipping: <b>${props.data.shipping_fee}</b></p>
            <p>Revenue: <b>${props.data.balance}</b></p>
            <p>Your profit: <b>${props.data.item_profit}</b></p>
        </div>
    );
};



export default Calculations;