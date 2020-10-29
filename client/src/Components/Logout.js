import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../api/api';
import { userInfoContext } from '../userInfoContext';

const Logout = () => {
    const { tokens, setTokenValues, setUserValue, setExpense, setAuth } = useContext(userInfoContext);
    const history = useHistory();

    async function logout(){
        await API.post('/logout', {}, { header: { authorization: tokens.accessToken} }).then(response => {
            setTokenValues({});
            setUserValue("");
            setExpense([]);
            setAuth(false);
            history.push('/login');
        });
    }
    return(
        <button onClick={logout}>Logout</button>
    )
}

export default Logout;