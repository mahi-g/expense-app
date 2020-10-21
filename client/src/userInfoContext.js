import React, { useState, createContext } from 'react';

export const userInfoContext = createContext();
export const userInfoContextProvider = (props) => {
    const [currentUser, setUser] = useState("");
    const [expenseList, setExpense] = useState([]);
    const [tokens, setTokens] = useState({});

    return(
        <userInfoContext.Provider value={[currentUser, setUser],[expenseList, setExpense]}>
            {props.children}
        </userInfoContext.Provider>
    );
};
