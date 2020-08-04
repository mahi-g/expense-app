import React from 'react';
import {getPaypalFee, getSellerFee, getBalance, getProfit} from "./mathFunctions"
//All strings that will be changed sparingly/not at all should be established beforehand..
const resultTableHeaders = ["Sold", "Paid", "Quantity", "Shipping", "Other", "Paypal Fee", "Seller Fee", "Profit", "Platform", "Date"];

export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            balance: 0,
            itemProfit: 0,
            paypalFee: 0,
            sellerFee: 0,
            shippingFee: 0,
            netProfit: 0,
        };
        this.handleFormInputs = this.handleFormInputs.bind(this);
    }

    handleFormInputs(event) {
        event.preventDefault();
        const target = event.target;
        const form = {};
        for(let i = 0; i < target.length; i++){
            form[target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
        const paypalFee = getPaypalFee(form.sold);
        const sellerFee = getSellerFee(form.platform, form.sold)
        const balance =  getBalance(form.sold,paypalFee,sellerFee,form.shipping,form.other);
        const itemProfit = getProfit(balance, form.paid);
        
        console.log("current", this.state);
        this.setState((previous) => {
                return {
                    list: previous.list.concat([{
                        sold:form.sold,
                        paid:form.paid,
                        quantity: 1,
                        shippingFee: form.shipping,
                        other:form.other,
                        paypalFee,
                        sellerFee,
                        itemProfit,
                        platform:form.platform,
                        date:form.date
                    }]),
                    balance,
                    itemProfit,
                    paypalFee,
                    sellerFee,
                    shippingFee: form.shipping,
                    netProfit: previous.netProfit + itemProfit
                }
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("previous state", prevState);
        const json = JSON.stringify(this.state);
        console.log("Updated:", this.state);
        localStorage.setItem('foooooo', json);
        console.log("Updated");
    }

    componentDidMount() {
        let data;
        try {
            data = localStorage.getItem('foooooo');
            data = JSON.parse(data);
            console.log("Mount Data:", data);
            if (data.list) {
                this.setState({
                    list: data.list,
                    balance: data.balance,
                    itemProfit: data.itemProfit,
                    paypalFee: data.paypalFee,
                    sellerFee: data.sellerFee,
                    shippingFee: data.shippingFee,
                    netProfit: data.netProfit

                });
            }
        } catch (error) {
            data = error.message
        }
        console.log("did mount");
        console.log("mount current", this.state);
    }

    render() {
        const display = this.state.list;
        console.log("This is ", display);
        return (
            <div>
                <Forms handleFormInputs={this.handleFormInputs}/>
                <p>PayPal: {this.state.paypalFee}</p>
                <p>Seller Fee: {this.state.sellerFee}</p>
                <p>Estimated Shipping: {this.state.shippingFee}</p>
                <p>Money you keep: {this.state.balance}</p>
                <p><b>Your profit:{this.state.itemProfit}</b></p>

                <p><b>History</b></p>
                {this.state.list.length === 0 && (<p>Add an expense to get started</p>)}
                <table>
                    <ItemTableHeaders headers={resultTableHeaders} listCount={this.state.list.length}/>
                    <ItemTableContents list={this.state.list}/>
                </table>
                <h4>Your net profit: {this.state.netProfit}</h4>


            </div>
        )
    }
}

/**
 *
 * Originally you had this as a class. It did not need to be a class so I changed it to a function
 * You also seem to be using un-collapsed tags. An un-collapsed tag is a tag that has no inner contents between
 * its open and close statements. I have changed your un-collapsed tags to collapsed ones. Example:
 *
 * Collapsed:
 * <Component/>
 *
 * Un-Collapsed:
 * <Component></Component>
 *
 * Basically, if you aren't putting anything inside of a tag, there is no reason for it to be un-collapsed.
 *
 */
function Forms(props) {
    return (
        <div>
            <form onSubmit={props.handleFormInputs}>
                <input type="number" name="paid" placeholder="price you paid" step="0.01" min="0"/>
                <input type="number" name="sold" placeholder="sold" step="0.01" min="0"/>
                <input type="number" name="shipping" placeholder="shipping" step="0.01" min="0"/>
                <input type="number" name="other" placeholder="other" step="0.01" min="0"/>
                <input type="month" name="date" defaultValue="2020-08"/>
                <select name="platform">
                    <option value="Etsy">Etsy</option>
                    <option value="Depop">Depop</option>
                    <option value="Ebay">Ebay</option>
                </select>
                <button>Submit</button>
            </form>
        </div>
    )
}

/**
 *
 * This function in its original form existed inside the render function of App Class, I've mode it into a function.
 * I've also changed the way it works from being a giant mess of lines that call the expense object keys one by one to
 * a cleaner solution that loops through each key of the expense object and creates an array of <td>. Once the table
 * data is created, it's put it into a <tr> wrapper and returned as the result of the Arrays.map() lambda being called.
 * This is done for every entry in props.list, and the end result is a collection of table rows which is wrapped in
 * a <tbody> and returned as the result of the function.
 *
 * As a prerequisite to this change, I've had to reorder the way you add the object keys to a given entry in the state
 * variable list. This should not affect anything else.
 *
 */
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
            </tr>
        )
    });
    return (
        <tbody>
        {rows}
        </tbody>
    )
}

/**
 *
 * The explanation for ItemTable() also applies here, however implementation for it is a little bit different. Because
 * there is only ever going to be one table header, we can get away with just mapping the resultTableHeaders constant
 * established at the beginning of the file onto a lambda that transforms it into a <th>. Because this component should
 * only be rendered when list.length > 0,  if list.length < 1 then we'll instead render an empty div.
 *
 */
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
        return(<div/>)
    }
}

export {Calculator};

