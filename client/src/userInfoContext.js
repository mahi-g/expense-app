import React, { useState, createContext } from 'react';

export const userInfoContext = createContext();

export const UserInfoContextProvider = (props) => {
    const [currentUser, setUser] = useState("");
    const [expenseList, setExpense] = useState([]);
    const [tokens, setTokens] = useState({});
    const [isAuthenticated, setAuth] = useState(false);

    function setUserValue(value){
        setUser(value);
    }
    function setTokenValues(value){
        setTokens(value);
    }

    return(
        <userInfoContext.Provider value={{currentUser, tokens, expenseList, isAuthenticated, setUserValue, setTokenValues, setExpense, setAuth}}>
            {props.children}
        </userInfoContext.Provider>
    );
};
