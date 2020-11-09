import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axiosApiInstance from '../api/axios';
import { userInfoContext } from '../userInfoContext';

const Logout = () => {
    const { setUser, setExpense, setAuth } = useContext(userInfoContext);
    const history = useHistory();

    async function logout(){
        await axiosApiInstance.post('/logout').then(response => {
            setUser("");
            setExpense([]);
            setAuth(false);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');

            history.push('/login');
        });
    }
    return(
        <button onClick={logout}>Logout</button>
    )
}

export default Logout;