import React from 'react';
import CanvasJSReact from '../canvas-js/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Pie extends React.Component {
    constructor(props){super(props);}
	render() {
		const options = {
			animationEnabled: true,
			subtitles: [{
				fontSize: 24,
			}],
			data: [{
				type: "doughnut",
                indexLabel: "{name}: {y}",
                toolTipContent: "<b>{label}:</b> ${y}",
				dataPoints: [
					{ name: "Revenue", y: this.props.data.balance},
					{ name: "Shipping", y: this.props.data.shippingFee},
					{ name: "Paypal", y: this.props.data.paypalFee},
					{ name: "Seller Fee", y: this.props.data.sellerFee},
				]
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
export default Pie;