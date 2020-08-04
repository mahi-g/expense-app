import React from 'react';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:  [],
            moneyYouKeep: 0,
            itemProfit: 0,
            paypalFee : 0,
            depopFee: 0,
            shippingFee: 0,
            netProfit: 0,
            
        }
        this.handleFormInputs = this.handleFormInputs.bind(this);
    }
    handleFormInputs(e){
        e.preventDefault();
        const paid = e.target.elements.paid.value;
        const sold = e.target.elements.sold.value;
        const shipping = e.target.elements.shipping.value;
        const other = e.target.elements.other.value;
        const platform = e.target.elements.platform.value;
        const date = e.target.elements.date.value;

        const paypal = Math.floor((sold*0.029+0.3)*100)/100;
        const depop = sold*0.1;
        const balance = Math.floor((sold - paypal - depop - shipping - other)*100)/100;
        const profit = Math.floor((balance - paid)*100)/100;
        console.log("current",this.state);
        this.setState((previous) => {
            return {
                list: previous.list.concat([{sold, paid, shipping, other, quantity:1, platform,
                    itemProfit:profit, paypalFee:paypal, depopFee: depop, shippingFee:shipping, date}]),
                moneyYouKeep: balance,
                itemProfit: profit,
                paypalFee : paypal,
                depopFee: depop,
                shippingFee: shipping,
                netProfit: previous.netProfit+profit
                }
            } 
        );
    }
    
    componentDidUpdate(prevProps, prevState){
        console.log("previous state",prevState)
        const json = JSON.stringify(this.state);
        console.log("Updated:",this.state);
        localStorage.setItem('fooooo', json);
        console.log("Updated");    
    }

    componentDidMount(){
            let data;
            try{
                data = localStorage.getItem('fooooo');
                data = JSON.parse(data);
                console.log("Mount Data:",data);
                if(data.list){
                    this.setState(()=>({
                        list: data.list,
                        moneyYouKeep: data.moneyYouKeep,
                        itemProfit: data.itemProfit,
                        paypalFee : data.paypalFee,
                        depopFee: data.depopFee,
                        shippingFee: data.shippingFee,
                        netProfit: data.netProfit

                    }));
                }
            }
            catch(error){
                data=error.message
            }
        console.log("did mount");
        console.log("mount current",this.state);
    }
    render(){
        const display = this.state.list;
        console.log("This is ",display);
        return (
            <div>
                <h1>Header</h1>
                <Forms handleFormInputs={this.handleFormInputs}/>
                <p>PayPal: {this.state.paypalFee}</p>
                <p>Depop Fee: {this.state.depopFee}</p>
                <p>Estimated Shipping: {this.state.shippingFee}</p>
                <p>Money you keep: {this.state.moneyYouKeep}</p>
                <p><b>Your profit:{this.state.itemProfit}</b></p>

                <p><b>History</b></p>
                {this.state.list.length === 0 && (<p>Add an expense to get started</p>)}
                <table>
                    { this.state.list.length !== 0 &&
                        <thead><tr>
                            <th>Sold</th>
                            <th>Paid</th>
                            <th>Quantity</th>
                            <th>Shipping</th>
                            <th>Other</th>
                            <th>PayPal Fee</th>
                            <th>Seller Fee</th>
                            <th>Profit</th>
                            <th>Platform</th>
                            <th>Date</th>

                        </tr></thead>
        }
                       { 
                    this.state.list.map((expense, index) => (
                      <tbody  key={index}><tr>
                            <td>{expense.sold}</td>
                            <td>{expense.paid}</td>
                            <td>{expense.quantity} </td>
                            <td>{expense.shippingFee}</td>
                            <td>{expense.other}</td>
                            <td>{expense.paypalFee}</td>
                            <td>{expense.depopFee}</td>
                            <td>{expense.itemProfit}</td>
                            <td>{expense.platform}</td>
                            <td>{expense.date}</td>
                        </tr></tbody>
                    ))
                }
                </table>
                <h4>Your net profit: {this.state.netProfit}</h4>
                    
               
                
            </div>
        )
    }
}



class Forms extends React.Component{
   
    render(){
        return(
            <div>
                <form onSubmit={this.props.handleFormInputs}>
                    <input type="number" name="paid" placeholder="price you paid"  step="0.01" min="0"></input>
                    <input type="number" name="sold" placeholder="sold" step="0.01" min="0" ></input>
                    <input type="number" name="shipping" placeholder="shipping" step="0.01" min="0" ></input>
                    <input type="number" name="other" placeholder="other" step="0.01" min="0"></input>
                    <input type="month" name="date" defaultValue="2020-08"></input>
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
}

export {App};

