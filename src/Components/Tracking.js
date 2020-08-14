import React from 'react';


class Tracker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            trackingId: "9400128206335287197597"
        }
    }

    async readData(){
        fetch("https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=(" +
            "<TrackRequest USERID=\"959NA0006949\">" +
            "<TrackID ID=" + this.state.trackingId + "}></TrackID>" +
            "</TrackRequest>)"
        ).then(response => {
            console.log(response);
        })
    }
    async componentDidMount(){
        await this.readData();
    }

    render(){
        return(<div>Tracker</div>)
    }
}


export default Tracker;
