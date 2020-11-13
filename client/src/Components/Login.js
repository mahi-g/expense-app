import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userInfoContext } from '../userInfoContext';
import axiosApiInstance from '../api/axios';


const Login = () => {
    const [error, setError] =  useState(false);
    const {currentUser, trackingNums, setUser, setTrackingNums, setExpense, setAuth} = useContext(userInfoContext);

    const history = useHistory();

    async function handleLogin(e){
        e.preventDefault();
        console.log(e.target.username.value);
        await axiosApiInstance.post('/login', {}, {auth: {username: e.target.username.value, password: e.target.password.value}, withCredentials: true })
             .then( response => {
                 console.log(response);
                 if(response.data !== undefined){
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('username', response.config.auth.username);
                    setUser(response.config.auth.username);
                    setAuth(true);
                    console.log("handle login");
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
        console.log(currentUser);
        console.log(localStorage.getItem('accessToken'));

        if(localStorage.getItem('accessToken') !== null ){
            ( async () => {
                await axiosApiInstance.get('/expenses').then( 
                        response => {
                            if(response != undefined){
                                setExpense(response.data.expenses);
                            }
                });
                await axiosApiInstance.get(`/tracking`).then(
                    response => {
                        console.log(response);
                        if(response != undefined){
                            setTrackingNums([response.data.tracking[0].tracking_num]);
                        }
                    }).catch(error => console.log(error));
                        
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
