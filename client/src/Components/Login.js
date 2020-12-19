import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userInfoContext } from '../userInfoContext';
import axiosApiInstance from '../api/axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import man_with_laptop from '../man_with_laptop.svg';

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '66vw'
      },
      gridContainer: {
        display: 'flex',
        flex: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto'
      }
}));


const Login = () => {
    const [error, setError] =  useState(false);
    const {currentUser, setUser, setTrackingNums, setExpense, setAuth} = useContext(userInfoContext);

    const classes = useStyles();
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
        if(currentUser !== ""){
            console.log("Useeffect");

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

        <Grid container >
        <Grid item md={12} className={classes.gridContainer}>
    <Card className={classes.card}>
        { 
            currentUser === "" ?  
            (
            <Grid container>
                <Grid item md={6}>
                    <img src={man_with_laptop} alt="bag icon" style={{width: '100%', height: 'auto', overflow:'hidden', display:'block'}} />
                </Grid>

                <Grid item md={6}>
                    
                    <form onSubmit={handleLogin}>
                        { error && <p>incorrect username or password</p> }
                        <p>Username</p>
                        <input id="username" type="text" name="username" required />
                        <p>Password</p>
                        <input id="password" type="password" name="password" required />
                        <br/>
                        <br/>
                        <br/>

                        <button>Login</button>
                    </form>
                </Grid>
            </Grid>


            ) : <p>You are logged in as {currentUser}</p>
            
        }
    </Card>
    </Grid>
    </Grid>
    );
}


export default Login;
