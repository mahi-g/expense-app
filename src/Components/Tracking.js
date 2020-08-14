import React from 'react';



class Tracker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackingId: "9400128206335287197597"
        }
    }

    async readData() {
        fetch(trackingAPICall(this.state.trackingId))
            .then(response => response.text())
            .then(text => console.log(text))
    }

    async componentDidMount() {
        await this.readData();
    }

    render() {
        return (<div>Tracker</div>)
    }
}

function trackingAPICall(trackingNum){
    return "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=" +
        "<TrackRequest USERID=\"959NA0006949\">" +
        "<TrackID ID=\"" + trackingNum + "\"/>" +
        "</TrackRequest>"
}

export default Tracker;
