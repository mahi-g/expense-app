import React, { useState, createContext } from 'react';

export const userInfoContext = createContext();

export const UserInfoContextProvider = (props) => {
    const [currentUser, setUser] = useState("");
    const [expenseList, setExpense] = useState([]);
    const [token, setAccessToken] = useState({});
    const [isAuthenticated, setAuth] = useState(false);


    return(
        <userInfoContext.Provider value={{currentUser, token, expenseList, isAuthenticated, setUser, setAccessToken, setExpense, setAuth}}>
            {props.children}
        </userInfoContext.Provider>
    );
};
