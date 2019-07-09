// container window size
let cwH = 1000;
let cwW = 1000;

//create window containers
let container = d3.select("#container")
                  .append("div")

let svgArea = container.append("svg")
                        .attr("height", cwH)
                        .attr("width", cwW);


// //title
// item.append("div")
//   .attr("class", "calTitle")
//   .text(""+(i+1));
//
// //container for content
// item.append("svg")
//   .attr("id","win"+(i+1).toString())
//   .attr("height", cwH-titlePadding)
//   .attr("width", cwW);
