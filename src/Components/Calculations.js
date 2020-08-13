import React from 'react';
import "../App.css"

const Calculations = (props) => {
    return (
        <div className="Cardstyle">
            <p>PayPal Fee: <h3>${props.data.paypalFee}</h3></p>
            <p>Seller Fee: <h3>${props.data.sellerFee}</h3></p>
            <p>Shipping: <h3>${props.data.shippingFee}</h3></p>
            <p>Revenue: <h3>${props.data.balance}</h3></p>
            <p>Your profit: <h3>${props.data.itemProfit}</h3></p>
        </div>
    );
};



export default Calculations;