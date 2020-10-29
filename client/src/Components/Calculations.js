import React, {useContext} from 'react';
import "../App.css"
import {userInfoContext} from '../userInfoContext';
const Calculations = (props) => {
    const {tokens, setTokenValues, setUserValue} = useContext(userInfoContext);

    return (
        <div className="Cardstyle">
            <p>PayPal Fee: <b>${props.data.paypal_fee}</b></p>
            <p>Seller Fee: <b>${props.data.seller_fee}</b></p>
            <p>Shipping: <b>${props.data.shipping}</b></p>
            <p>Revenue: <b>${props.data.balance}</b></p>
            <p>Your profit: <b>${props.data.item_profit}</b></p>
        </div>
    );
};



export default Calculations;