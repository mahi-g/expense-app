import React from 'react';
import * as d3 from "d3";
import "../App.css";

export class App extends React.Component {
    
    componentDidMount(){
        const data = [2,35,14,20,30,44,58];
        this.drawBarChart(data);
    }

    drawBarChart(data){
        const height = 400;
        const width = 500;
        const svgCanvas = d3.select("div")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .style("border", "1px solid black")

        svgCanvas.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("height",(d) => d*5)
            .attr("width", 30)
            .attr("x", (d,i)=> i*40)
            .attr("y", (d) => height-d*5)
            .attr("fill","salmon")
            .attr("class","bar")
            
        
        svgCanvas.selectAll("text")
            .data(data).enter()
            .append("text")
            .attr("x", (d,i)=>i*40+5)
            .attr("y", (d)=>height-d*5-5)
            .text((d) => d)

    }
    render(){
        return (
            <div className="bar"></div>
        );  
    }
};

