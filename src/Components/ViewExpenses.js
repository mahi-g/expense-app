import React from 'react';


//All strings that will be changed sparingly/not at all should be established beforehand..
const resultTableHeaders = ["Sold", "Paid", "Quantity", "Shipping", "Other", "Paypal Fee", "Seller Fee", "Profit", "Platform", "Date"];

class ViewExpenses extends React.Component {
    render(){
        return(
            <div className="GridItem5">
                {this.props.expenseList.length === 0 && (<p>Add an expense to get started</p>)}
                <table className="TableS Card Item5">
                    <ItemTableHeaders headers={resultTableHeaders} listCount={this.props.expenseList.length}/>
                    <ItemTableContents list={this.props.expenseList}/>
                </table>
            </div>
        );
    }

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
    }else{
        return(<thead></thead>)
    }
}

function ItemTableContents(props) {
    const rows = props.list.map((expense, index) => {
        let tableData = [];
        for (const [key, value] of Object.entries(expense)) {
            tableData.push(
                <td>{value}</td>
            )
        }
        return (
            <tr key={index}>
                {tableData}
                <button>x</button>
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