import React from 'react';

//9400128206335287201003 another id

class TrackPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveryData: [],
            trackingIds: ["9400128206335276889946", "9400128206335287197597"],
        }
        this.addTracking = this.addTracking.bind(this);
        this.readData = this.readData.bind(this);

    }

    addTracking(e) {
        e.preventDefault();
        let target = e.target.track.value;
        this.setState((state)=>({trackingIds:state.trackingIds.concat([target])}));
        this.readData([target]); //IS THIS BADDD?
        console.log(this.state.trackingIds);
    }

    cleanData(text, trackingId){

        let parser, xmlDoc, summary, detail;
        let deliveryDatas = [];

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text,"text/xml");


        detail = xmlDoc.getElementsByTagName("TrackSummary");
        summary = detail[0].childNodes[0].nodeValue;

        detail = xmlDoc.getElementsByTagName("TrackDetail");
        for(let i = 0; i < detail.length; i++){
            deliveryDatas.push(detail[i].childNodes[0].nodeValue)
        }

        this.setState((state)=>{
            return {
                deliveryData: this.state.deliveryData.concat([{trackingId,summary,deliveryDatas}])
            }
        });
        console.log(this.state.deliveryData);


    }
    async readData(tracking) {
        
        if(tracking.length>1){
            this.setState(()=>({
                deliveryData: []
            }));
        }

        const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML="+
        "<TrackRequest USERID=\"959NA0006949\">"+
        trackingAPICall(tracking)+ 
        "</TrackRequest>";

        fetch(url)
            .then(response => response.text())
            .then(text => {
                console.log(text);
                let x = text.split("</TrackInfo>");
                x.map((d,i)=>{
                    if(i !== x.length-1) {
                        this.cleanData(x[i], tracking[i]);
                    }
                })
            })

    }

    async componentDidMount() {
        await this.readData(this.state.trackingIds);
    }

    
   
  
  
   
    render() {

        return (
            <div>
                <form onSubmit={this.addTracking}>
                    <input type="text" placeholder="Add a number to track" name="track"></input>
                    <button>Track</button>
                </form>
            
                <div id="track">
                    <p>Data as of</p>
                    <button type="submit" onClick={()=>this.readData(this.state.trackingIds)}>Refresh</button>
                    <PrintData deliveryData={this.state.deliveryData}/>
                </div>
            </div>)
    }
}

const PrintData = (props) => {
    return(
    <div>
        {props.deliveryData.map((d)=>(<div className="Card"><h4>{d.trackingId}</h4><p>{d.summary}</p></div>))}
    </div>
    )
}

function trackingAPICall(trackingNums){
    let trackID = "";
    trackingNums.map((id) => trackID+="<TrackID ID=\"" + id + "\"/>");
    return trackID;
}



export default TrackPackages;

