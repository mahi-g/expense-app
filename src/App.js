import React from 'react';
import Expense from './Components/Expense';
import './App.css'


class App extends React.Component {
    render() {
        return(
            <div className={"App"}>
                <div className={"Body"}>
                    <Expense/>
                </div>
               
                <div className={"Footer"}>
                    {/*Empty For Now*/}
                </div>
            </div>
        )
    }
}

export {App};

