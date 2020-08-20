import * as d3 from "d3";


export const drawBarChart = (data) => {

    d3.select("svg").remove();
    const height = 250;
    const width = 450;

    const xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0,d3.max(data, (d)=>d.sold)])
        .range([height,d3.max(data, (d)=> d.sold)]);
 

    const svgCanvas = d3.select("#charts")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .style("border", ".5px solid #333333");

    svgCanvas.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", (d) => height - yScale(d.sold))
        .attr("width", ()=> {
            if(data.length > 10){
                return 5;
            }
            return 30;
        })
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d) => yScale(d.sold))
        .attr("fill", (d) => {
            if(d.platform === "Ebay") { return "#3ba1d9";}
            else if(d.platform === "Etsy") { return "orange";}
            return "#46c6a8";
        })
        .attr("class", "bar");

    svgCanvas.selectAll("text")
        .data(data).enter()
        .append("text")
        .style("color", "#333333")
        .attr("x", (d, i) => xScale(i) + 5)
        .attr("y", (d) => yScale(d.sold)-5)
        .text((d) => d.sold)

        console.log(yScale(200));
};
