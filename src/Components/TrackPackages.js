import React from 'react';


let DELIVERYDATA = [];

class TrackPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackingIds: ["9400128206335276889946", "9400128206335287197597"]
        }
    }
    async readData() {
        const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML="+
        "<TrackRequest USERID=\"959NA0006949\">"+
        trackingAPICall(this.state.trackingIds)+ 
        "</TrackRequest>";

        
        fetch(url)
            .then(response => response.text())
            .then(text => {
                let x = text.split("</TrackInfo>");

                for(let i = 0; i < x.length; i++){
                    if(i !== x.length-1) {
                        printData(x[i]);
                    }
                }
                
                console.log(DELIVERYDATA);
                document.getElementById("track").innerHTML=DELIVERYDATA;
            })
    }

    async componentDidMount() {
        await this.readData();
    }
    render() {
        return (<div id="track"></div>)
    }
}


function trackingAPICall(trackingNums){
    let trackID = "";
    trackingNums.map((id) => trackID+="<TrackID ID=\"" + id + "\"/>");
    return trackID;
}

function printData(text){
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(text,"text/xml");

    let y = xmlDoc.getElementsByTagName("TrackSummary");
    let summary = y[0].childNodes[0].nodeValue;
    DELIVERYDATA.push("<h3>"+summary+"</h3>");

    y = xmlDoc.getElementsByTagName("TrackDetail");
    for(let i = 0; i < y.length; i++){
        DELIVERYDATA.push("<p>"+y[i].childNodes[0].nodeValue+"</p>");
    }
}

export default TrackPackages;

