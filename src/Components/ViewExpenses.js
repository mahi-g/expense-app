import React from 'react';

import ItemTableContents from "./ItemTableContents";
import ItemTableHeaders from "./ItemTableHeaders";



//All strings that will be changed sparingly/not at all should be established beforehand..
const resultTableHeaders = ["Sold", "Paid", "Quantity", "Shipping", "Other", "Paypal Fee", "Seller Fee", "Profit", "Platform", "Date"];

class ViewExpenses extends React.Component {
    render(){
        return(
            <div>
                {this.props.expenseList.length === 0 && (<p>Add an expense to get started</p>)}
                <table className="TableS Card Item5">
                    <ItemTableHeaders headers={resultTableHeaders} listCount={this.props.expenseList.length}/>
                    <ItemTableContents list={this.props.expenseList}/>
                </table>
            </div>
        );
    }


}
export default ViewExpenses;