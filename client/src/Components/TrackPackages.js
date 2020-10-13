import React from 'react';
import API from '../api/api';
//9400128206335287201003 another id
//9400128206335276889946
//9400128206335287197597
const user_id = 'mahi1234';

class TrackPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveryData: [],
            trackingIds: [],
            updated: false,
            error: false
        }
        this.addTracking = this.addTracking.bind(this);
        this.readData = this.readData.bind(this);
        this.removeTracking = this.removeTracking.bind(this);
    }

    
    async removeTracking(e) {
        const value = e.target.value;
        await API.delete(`/tracking/${user_id}/${value}`).then( response => {
                //console.log(response.data.tracking[0].tracking_num);
                this.setState({trackingIds: response.data.tracking[0].tracking_num});
            });
        this.readData(this.state.trackingIds);
    }

    //handles tracking number from form input, adds it to database, updates state
    //first checks if input value already exists in the state trackingId array
    //then checks if trackingId is empty, sends post request to insert trackingId array into table, 
    //else update existing array with a put request
    async addTracking(e){
        e.preventDefault();
        let target = e.target.track.value;
        if(this.state.trackingIds.indexOf(target) === -1) {
            if(this.state.trackingId){
                await API.post(`/tracking/${user_id}/${target}`).then(
                    response => {
                        console.log(response);
                    }  
                );
            }
            else {
                await API.put(`/tracking/${user_id}/${target}`).then(
                    response => {
                        console.log("PUT");
                        console.log(response);
                    }  
                );
            }
            //get request to retrieve updated table, updates states, and reruns readData function with updated value
            //to fetch data
            await API.get(`/tracking/${user_id}`)
                .then(response => {
                    console.log("Response"+response.data.data.tracking[0].tracking_num);
                    this.setState({trackingIds: response.data.data.tracking[0].tracking_num});
                });
            this.readData(this.state.trackingIds);
        }
        else {
            console.log("already exists");
        }
       
    }

    cleanData(text, trackingId){
        let parser, xmlDoc, summary, detail;
        let deliveryDatas = [];

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text,"text/xml");

        detail = xmlDoc.getElementsByTagName("TrackSummary");
        summary = detail[0].textContent;
        console.log(summary);

        detail = xmlDoc.getElementsByTagName("TrackDetail");
        for(const [key, value] of Object.entries(detail)) {
            deliveryDatas.push(value.childNodes[0].nodeValue)
        }
        
        this.setState(()=>(
            {
                deliveryData: this.state.deliveryData.concat([{trackingId,summary,deliveryDatas}])
            }
        ));
        console.log(this.state.deliveryData);
    }

    async readData(tracking) {
        //reset delivery data to avoid duplication
        if(tracking.length>=1){
            this.setState(()=>({deliveryData: []}));
        }
        const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML="+
        "<TrackRequest USERID=\"959NA0006949\">"+
        trackingAPICall(tracking)+ 
        "</TrackRequest>";

        await fetch(url)
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
        await API.get(`/tracking/${user_id}`)
            .then(response => {
               this.setState({trackingIds: response.data.data.tracking[0].tracking_num});
               console.log(response.data.data.tracking);
            });
        console.log(this.state);
        this.readData(this.state.trackingIds);
        
    }

    render() {
        return (
            <div className="GridItem2">
                <form onSubmit={this.addTracking} className="Card">
                {
                    this.state.error && <p>error</p>
                }
                    <input type="text" placeholder="Add a number to track" name="track"></input>
                    <button>Track</button>
                </form>
                {this.state.trackingIds && <div>
                    <p>Data as of</p>
                    <button type="submit" onClick={()=>this.readData(this.state.trackingIds)}>Refresh</button>
                    <PrintData 
                        deliveryData={this.state.deliveryData}
                        removeTracking={this.removeTracking}
                    />
                </div>
                }
            </div>
            );
    }
}

const PrintData = (props) => {
    return(
    <div>
        {props.deliveryData.map((d)=>(
            <div className="Card">
                <h4>{d.trackingId}</h4>
                <p>{d.summary}</p>
                <button value={d.trackingId} onClick={props.removeTracking}>Remove</button>
            </div>))}
    </div>
    )
}

function trackingAPICall(trackingNums){
    let trackID = "";
    trackingNums.map((id) => trackID+="<TrackID ID=\"" + id + "\"/>");
    return trackID;
}

export default TrackPackages;

