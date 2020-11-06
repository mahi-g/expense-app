import React from 'react';
 
//9400128206335287201003 
//9400128206335276889946
//9400128206335287197597

//ISSUE -> HANDLING INVALID TRACKING IDS
//ISSUE -> GETTING AN ERROR MESSAGE FROM USPS api

const TrackPackages = (props) => {
    return (
            <div className="GridItem2">
                <form onSubmit={props.addTracking} className="Card">
                {
                    props.state.error && <p>error</p>
                }
                    <input type="text" placeholder="Add a number to track" name="track"></input>
                    <button>Track</button>
                </form>
                {
                    props.state.trackingIds && <div>
                        <p>Data as of</p>
                        <button type="submit" onClick={()=>props.readData(props.state.trackingIds)}>Refresh</button>
                        <PrintData 
                            deliveryData={props.state.deliveryData}
                            removeTracking={props.removeTracking}
                        />
                    </div>
                }
            </div>
        );
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


export default TrackPackages;

