import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { UserInfoContextProvider } from './userInfoContext';

import * as serviceWorker from './serviceWorker';
import './index.css';


ReactDOM.render(
  <React.StrictMode>
    <UserInfoContextProvider>
        <App />
    </UserInfoContextProvider>
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
