// container window size
let cwH = 1000;
let cwW = 1000;

const innerR = 100;
const outerR = 450;
//const dayAngle = 360/365;
const dayAngle = 2*Math.PI/365;

//datastorage
let datastorage = {};

//create window containers
let container = d3.select("#container")
                  .append("div")

//create SVG container
let svgArea = container.append("svg")
                        .attr("height", cwH)
                        .attr("width", cwW);





/**************************
* Load data
**************************/
function loadData() {
  return Promise.all([
    d3.csv("data/loans1.csv")
  ]).then(datasets => {

    console.log("Loading data");

    datastorage.dates = datasets[0];
    datastorage.dates.forEach(function(d){
      d.id = +d.id;
      d.inDays = +d.inDays;
      d.outDays = +d.outDays;
      d.numDays = +d.numDays;
    })

    return datastorage;
  })
}//loadData

/**************************
* Draw data in window
**************************/
function showData(){
  //inCircle
  // svgArea.append("g")
  //       .attr("id","indays")
  //       .selectAll("circle")
  //       .data(datastorage.dates)
  //       .enter()
  //       .append("circle")
  //       .attr("cx", function(d,i){return cwW/2+innerR*Math.cos(d.inDays*dayAngle)})
  //       .attr("cy", function(d,i){return cwH/2+innerR*Math.sin(d.inDays*dayAngle)})
  //       .attr("r", 5)
  //       .attr("fill","blue")
  //       .attr("opacity", 0.5);
  //
  //   //outCircle
  //   svgArea.append("g")
  //         .attr("id","outdays")
  //         .selectAll("circle")
  //         .data(datastorage.dates)
  //         .enter()
  //         .append("circle")
  //         .attr("cx", function(d,i){return cwW/2+outerR*Math.cos(d.outDays*dayAngle)})
  //         .attr("cy", function(d,i){return cwH/2+outerR*Math.sin(d.outDays*dayAngle)})
  //         .attr("r", 5)
  //         .attr("fill","yellow")
  //         .attr("opacity", 0.5)

  svgArea.append("circle")
    .attr("cx",cwW/2)
    .attr("cy",cwH/2)
    .attr("r", innerR)
    .attr("stroke","yellow")
    .attr("fill","transparent")
    svgArea.append("circle")
      .attr("cx",cwW/2)
      .attr("cy",cwH/2)
      .attr("r", outerR)
      .attr("stroke","yellow")
      .attr("fill","transparent")


    // svgArea.append("circle")
    //   .attr("cx",cwW/2 + innerR*Math.cos(0-Math.PI/2))
    //   .attr("cy",cwH/2 + innerR*Math.sin(0-Math.PI/2))
    //   .attr("r", 10)
    //   .attr("fill","yellow")
    //
    //   svgArea.append("circle")
    //     .attr("cx",cwW/2 + innerR*Math.cos(0))
    //     .attr("cy",cwH/2 + innerR*Math.sin(0))
    //     .attr("r", 10)
    //     .attr("fill","green")
    //lines
    svgArea.append("g")
          .attr("id", "lines")
          .selectAll("path")
          .data(datastorage.dates)
          .enter()
          .append("path")
        //   .attr("d", function(d){return "M"+(cwW/2+innerR*Math.cos(d.inDays*dayAngle-Math.PI/2))+" "+(cwW/2+innerR*Math.sin(d.inDays*dayAngle-Math.PI/2))+
        //                                     "L"+(cwW/2+outerR*Math.cos(d.outDays*dayAngle-Math.PI/2))+" "+(cwW/2+outerR*Math.sin(d.outDays*dayAngle-Math.PI/2))
        // })
        .attr("d", function(d){return "M"+(cwW/2+innerR*Math.cos(d.inDays*dayAngle-Math.PI/2))+", "+(cwW/2+innerR*Math.sin(d.inDays*dayAngle-Math.PI/2))+
                                          "Q"+(cwW/2+outerR*Math.cos(d.inDays*dayAngle-Math.PI/2))+", "+(cwW/2+outerR*Math.sin(d.inDays*dayAngle-Math.PI/2))+
                                          " "+(cwW/2+outerR*Math.cos(d.outDays*dayAngle-Math.PI/2))+", "+(cwW/2+outerR*Math.sin(d.outDays*dayAngle-Math.PI/2))
      })
      //   .attr("d", function(d){return "M"+(cwW/2+innerR*Math.cos(d.inDays*dayAngle))+" "+(cwW/2+innerR*Math.sin(d.inDays*dayAngle))+
      //                                     "L"+(cwW/2+outerR*Math.cos(d.outDays*dayAngle))+" "+(cwW/2+outerR*Math.sin(d.outDays*dayAngle))
      // })
        .attr("fill","none")
          .attr("stroke", "white")

}//showData


/**************************
* Handling errors
**************************/
function errorHandler(e) {
  console.log("An error occurred");
  console.log(e);
}


//////////////////////////////////
loadData().then(showData).catch(errorHandler)
