import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
        width: '66vw',
      }
}));



const Signup = () => {
    const [ error, setError ] = useState(false);
    const history = useHistory();
    const classes = useStyles();

    async function handleSignUp(e){
        e.preventDefault();
        await axiosApiInstance.post('/signup', {
            username: e.target.username.value,
            password: e.target.password.value
        }).then(response => {
            history.push("/login");
        }).catch(e => {
            console.log("SignupError", e);
            setError(true);
        });
    }
    return (
        <Card className={classes.card}>
            <Grid container>
                <Grid item md={6}>
                    <img src={man_with_laptop} alt="bag icon" style={{width: '100%', height: 'auto', overflow:'hidden', display:'block'}} />
                </Grid>

                <Grid item md={6}>
                    <form onSubmit={handleSignUp}>
                        <label>Username</label>
                        <input type="text" name="username" required/>
                        <label>Password</label>
                        <input type="password" name="password" required/>
                        { error && <p>Invalid username or password</p> }
                        <button type="submit">Signup</button>
                    </form>
                </Grid>
            </Grid>
        </Card>
    );
}


export default Signup;
