import React from 'react';

const Signup = (props) => {
    return (
        <form onSubmit={props.handleLogin}>
            <label for="username">Username</label>
            <input type="text" name="username" required/>
            <label for="password">Password</label>
            <input type="password" name="password" required/>
        </form>
    );
}


export default Signup;
