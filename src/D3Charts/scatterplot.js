import * as d3 from "d3";

export const scatterplot = () => {
     const dataset = [
                  [ 34,    422 ],
                  [ 109,   220 ],
                  [ 310,   380 ],
                  [ 79,    89 ],
                  [ 420,   280 ],
                  [ 233,   355 ],
                  [ 333,   404 ],
                  [ 222,   167 ],
                  [ 78,    180 ],
                  [ 21,    377 ]
                ];


    const w = 500;
    const h = 500;

    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .style("border","1px solid black");

    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => d[0])
       .attr("cy", (d, i) => h - d[1])
       .attr("r", 5);

    svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       // Add your code below this line
       .attr("x", (d) => d[0]+5)
       .attr("y", (d) => h-d[1]+5)
       .text((d)=>{
         return d[0]+","+d[1];
       })
 };
 