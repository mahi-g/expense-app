import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userInfoContext } from '../userInfoContext';
import axiosApiInstance from '../api/axios';


const Login = () => {
    const [error, setError] =  useState(false);
    const {currentUser, setAccessToken, setUser, setExpense, setAuth} = useContext(userInfoContext);

    const history = useHistory();

    async function handleLogin(e){
        e.preventDefault();
        console.log(e.target.username.value);
        await axiosApiInstance.post('/login', {}, {auth: {username: e.target.username.value, password: e.target.password.value}, withCredentials: true })
             .then( response => {
                 console.log(response);
                 if(response.data !== undefined){
                    setAccessToken({accessToken: response.data.accessToken});
                    setUser(response.config.auth.username);
                    setAuth(true);
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('username', response.config.auth.username);

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
            ( async () => {
                await axiosApiInstance.get('/expenses')
                    .then( response => {
                        setExpense(response.data.expenses);
                });
            })()
        }
    },[currentUser]);
    
    
    return (
        <div>
        { 
            currentUser === "" ?  
            (
                <form onSubmit={handleLogin}>
                    { error && <p>incorrect username or password</p> }
                    <label>Username</label>
                    <input type="text" name="username" required />
                    <label>Password</label>
                    <input type="password" name="password" required />
                    <button>Login</button>
                </form>
            ) : <p>You are logged in as {currentUser}</p>
        }
        </div>
    );
}


export default Login;
