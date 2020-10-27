import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {userInfoContext} from '../userInfoContext';
import API from '../api/api';

const Login = () => {
    const [error, setError] =  useState(false);
    const {currentUser, tokens, setTokenValues, setUserValue, setExpense, setAuth} = useContext(userInfoContext);
    const history = useHistory();

    async function handleLogin(e){
        e.preventDefault();
        console.log(e.target.username.value);
        await API.post('/login', {}, {auth: {username: e.target.username.value, password: e.target.password.value}})
             .then(response => {
                 if(response.data !== undefined){
                    setTokenValues(response.data);
                    setUserValue(response.config.auth.username);
                    setAuth(true);
                    history.push("/dashboard");
                 }
             }).catch( e => {
                 console.log("Error", e);
                 if(e){
                    setError(true);
                 }
             }); 
    }
    useEffect( () => {
        console.log("Login useEffect");
        if(currentUser!==""){
            const g = { authorization: "Bearer " + tokens.accessToken };
            (async () => {
                await API.get('/expenses', { headers: g })
                    .then( response => {
                    console.log(response);
                    setExpense(response.data.expenses);
                });
            })()
        }
    },[currentUser]);

    return (
        <div>
            <form onSubmit={handleLogin}>
                { error && <p>incorrect username or password</p> }
                <label>Username</label>
                <input type="text" name="username" required/>
                <label>Password</label>
                <input type="password" name="password" required/>
                <button>Login</button>
                <p>{currentUser}</p>
            </form>
        </div>
    );
}


export default Login;
