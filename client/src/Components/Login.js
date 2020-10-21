import React from 'react';

const Login = (props) => {
    return (
        <div>
            <form onSubmit={props.handleLogin}>
                <label>Username</label>
                <input type="text" name="username" required/>
                <label>Password</label>
                <input type="password" name="password" required/>
                <button>Login</button>
            </form>
        </div>
    );
}


export default Login;
