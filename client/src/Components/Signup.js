import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosApiInstance from '../api/axios';


const Signup = (props) => {
    const [ error, setError ] = useState(false);
    const history = useHistory();

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
        <form onSubmit={handleSignUp}>
            <label>Username</label>
            <input type="text" name="username" required/>
            <label>Password</label>
            <input type="password" name="password" required/>
            { error && <p>Invalid username or password</p> }
            <button type="submit">Signup</button>
        </form>
    );
}


export default Signup;
