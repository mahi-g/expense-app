import React, { useContext } from 'react';
import {userInfoContext} from '../userInfoContext';

//All strings that will be changed sparingly/not at all should be established beforehand..
const resultTableHeaders = ["Sold", "Paid", "Shipping", "Other", "Paypal Fee", "Seller Fee", "Profit", "Platform", "Date"];

const ViewExpenses = (props) => {
    
    const {expenseList} = useContext(userInfoContext);
    return(
            <div className="GridItem5">
                {expenseList.length === 0 && (<p>Add an expense to get started</p>)}
                <table className="TableS Card">
                    <ItemTableHeaders headers={resultTableHeaders} listCount={expenseList.length}/>
                    <ItemTableContents 
                        list={expenseList}
                        handleDeleteOption={props.handleDeleteOption}
                    />
                </table>
            </div>
        );
}

function ItemTableHeaders(props) {
    if(props.listCount > 0){
        const data = props.headers.map((header, index) => (
            <th key={index}>{header}</th>
        ));
        return (
                <thead>
                    <tr>
                        {data}
                    </tr>
                </thead>
        )
    } else {
        return(<thead></thead>)
    }
}

function ItemTableContents(props) {
    let transaction_id;
    const rows = props.list.map((expense, index) => {
        let tableData = [];
        for (const [key, value] of Object.entries(expense)) {
            if(key !== 'username' && key !== 'transaction_id'){
                tableData.push(
                    <td>{value}</td>
                )
            }
            else if(key==='transaction_id') {
                transaction_id = value;
            }            
        }
        return (
            <tr key={transaction_id}>
                {tableData}
                <td><button value={transaction_id} onClick={props.handleDeleteOption}>x</button></td>
            </tr>
        )
    });
    return (
        <tbody>
            {rows}
        </tbody>
    )
}


export default ViewExpenses;