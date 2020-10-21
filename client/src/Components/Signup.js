import React from 'react';

const Signup = (props) => {
    return (
        <form onSubmit={props.handleLogin}>
            <label>Username</label>
            <input type="text" name="username" required/>
            <label>Password</label>
            <input type="password" name="password" required/>
            <button type="submit">Signup</button>
        </form>
    );
}


export default Signup;
