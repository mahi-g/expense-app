import React, { useState, createContext } from 'react';

export const userInfoContext = createContext();

export const UserInfoContextProvider = (props) => {
    const [currentUser, setUser] = useState("");
    const [trackingNums, setTrackingNums] = useState([]);
    const [expenseList, setExpense] = useState([]);
    const [isAuthenticated, setAuth] = useState(false);


    return(
        <userInfoContext.Provider value={{currentUser, trackingNums, expenseList, isAuthenticated, setUser, setTrackingNums, setExpense, setAuth}}>
            {props.children}
        </userInfoContext.Provider>
    );
};
