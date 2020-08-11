import React from 'react';
import Calculator from './Components/Calculator';
import Header from './Components/Header';
import './App.css'
class App extends React.Component {
    render() {
        return(
            <div className={"App"}>
                
                <div className={"Body"}>
                    <Calculator/>
                </div>
                <div className={"Footer"}>
                    {/*Empty For Now*/}
                </div>
            </div>
        )
    }
}

export {App};

