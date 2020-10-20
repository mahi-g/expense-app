import React from 'react';

const Login = (props) => {
    return (
        <div>
            <form onSubmit={props.handleLogin}>
                <label for="username">Username</label>
                <input type="text" name="username" required/>
                <label for="password">Password</label>
                <input type="password" name="password" required/>
            </form>
        </div>
    );
}


export default Login;
