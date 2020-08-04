import * as d3 from "d3";


export const drawBarChart = (data) => {
    const height = 400;
        const width = 500;
        const svgCanvas = d3.select("#charts")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .style("border", "1px solid black")

        svgCanvas.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("height",(d) => {
                return d.paid*5
            })
            .attr("width", 30)
            .attr("x", (d,i)=> i*40)
            .attr("y", (d) => height-d.paid*5)
            .attr("fill","salmon")
            .attr("class","bar")

        svgCanvas.selectAll("text")
            .data(data).enter()
            .append("text")
            .attr("x", (d,i)=>i*40+5)
            .attr("y", (d)=>height-d.paid*5-5)
            .text((d) => d.paid)

};