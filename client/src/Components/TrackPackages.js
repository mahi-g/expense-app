import React from 'react';
import axiosApiInstance from '../api/axios';
import {userInfoContext} from '../userInfoContext';
 
//9400128206335287201003 
//9400128206335276889946
//9400128206335287197597

//ISSUE -> HANDLING INVALID TRACKING IDS
//ISSUE -> GETTING AN ERROR MESSAGE FROM USPS api

class TrackPackages extends React.Component {
     
    constructor(props) {
        super(props);
        this.state = {
            deliveryData: [],
            trackingIds: [],
            error: false
        }
        this.addTracking = this.addTracking.bind(this);
        this.readData = this.readData.bind(this);
        this.removeTracking = this.removeTracking.bind(this);
    }

    static contextType = userInfoContext;

    //Remove data by making a delete request
    //If only one tracking number exists in the array, then sets the trackingId and deliveryData in the state to empty arrays
    //Else, deletes the array, updates the state with the response data, and recalls the readData() function to fetch data from 
    //the api  
    async removeTracking(e) {

        await axiosApiInstance.delete(`tracking/${e.target.value}`).then( response => {
            if(response.data.tracking[0].length === 0) {
                this.setState({trackingIds: [], deliveryData: []});
            }
            else {
                this.setState({trackingIds: response.data.tracking[0].tracking_num});
            }
        }).catch(error=> console.log(error));

        //if state
        if(this.state.trackingIds.length >= 1) {
            this.readData(this.state.trackingIds);
        }



        // if(this.state.trackingIds.length === 1) {
        //     await axiosApiInstance.delete(`tracking/${value}`).catch(error=> console.log(error));
        //     this.setState({trackingIds: [], deliveryData: []});
        // }
        // else {
        //     await axiosApiInstance.delete(`tracking/${value}`).then( response => {
        //         this.setState({trackingIds: response.data.tracking[0].tracking_num});
        //     }).catch(error=> console.log(error));
        //     this.readData(this.state.trackingIds);
        // }
    }

    //handles tracking number from form input, adds it to database, updates state
    //first checks if input value already exists in the state trackingId array
    //then checks if trackingId is empty or undefined, sends post request to insert trackingId array into table, 
    //else update existing array with a put request
    //updates trackingIds array in states
    async addTracking(e){
        e.preventDefault();
        const tracking_num = e.target.track.value;
        if(!this.state.trackingIds.includes(tracking_num)) {
            //check if trackingIds undefined or empty, 
            //if so, send a post request that adds the username and tracking numbers in the db tracking table
            await axiosApiInstance.post(`/tracking/${tracking_num}`).then(
                response => {
                    console.log(response);
                    this.setState({trackingIds:response.data.data[0].tracking_num});
                }  
            ).catch(error=> console.log(error));
            
            this.readData(this.state.trackingIds);
        }
        else {
            console.log("already exists");
        }
    }

    //Parse xml data for a trackingID
    cleanData(text, trackingId){
        let deliveryDatas = [];
        
        //Parse text to xml
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(text,"text/xml");

        //Get track summary
        let detail = xmlDoc.getElementsByTagName("TrackSummary");
        let summary = detail[0].textContent;

        //Get all data inside TrackDetail tags
        //Update state with the data
        detail = xmlDoc.getElementsByTagName("TrackDetail");
        for(const [key, value] of Object.entries(detail)) {
            deliveryDatas.push(value.childNodes[0].nodeValue)
        }
        this.setState(()=>(
            {
                deliveryData: this.state.deliveryData.concat([{trackingId,summary,deliveryDatas}])
            }
        ));
    }


    async readData(tracking) {
        //reset delivery data to avoid duplication
        this.setState(()=>({deliveryData: []}));

        //Create API url with userID and tracking numbers
        const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML="+
        "<TrackRequest USERID=\"959NA0006949\">"+
        trackingApiCall(tracking)+ 
        "</TrackRequest>";

        await fetch(url)
            .then(response => response.text())
            .then(text => {
                console.log(text);
                //Split text array by </TrackInfo> which puts the data for each tracking number into an array item
                let x = text.split("</TrackInfo>");
                //Iterate through each item in the array
                //Each item and adjacent tracking number is parsed with cleanData() function
                x.map((d,i)=>{
                    if(i !== x.length-1) {
                        this.cleanData(x[i], tracking[i]);
                    }
                })
            })
    }

    async componentDidMount() {
        console.log(this.context.token.accessToken);
        console.log("Tracking component did update");
        if(this.context.isAuthenticated){
            await axiosApiInstance.get(`/tracking`)
            .then(response => {
                console.log(response);
                response.data.tracking.length<1 ? this.setState({trackingIds: []}) : this.setState({trackingIds: response.data.tracking[0].tracking_num})
            }).catch(error => console.log(error));

            if(this.state.trackingIds.length !== 0){
                this.readData(this.state.trackingIds);
            }
        }
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
                {
                    this.state.trackingIds && <div>
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

function trackingApiCall(trackingNums){
    let trackID = "";
    trackingNums.map((id) => trackID+="<TrackID ID=\"" + id + "\"/>");
    return trackID;
}

export default TrackPackages;

