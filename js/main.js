// container window size
let cwH = 800;
let cwW = 800;

//const innerR = 100;
const outerR = 350;
const dayAngle = 2*Math.PI/365;

//datastorage
let datastorage = {};

//create window containers
let container = d3.select("#container")

//create SVG container
let svgArea = container.append("svg")
                        .attr("height", cwH)
                        .attr("width", cwW);

//create scales
let widthScale = d3.scaleLinear()
                    .range([1,30])
                    //adjust with data

let opScale = d3.scaleLinear()
  .range([0.2,0.8])
  //adjust with data


let colorScale = d3.scaleSequential()
                  .interpolator(d3.interpolateMagma)
                  //adjust with data

/**************************
* Utilities
***************************/

function getPath(item){
  let path = "";

  //OLDER IDEA with inner circle
  // let start = {
  //   x: cwW/2 + innerR*Math.cos(item.inDays*dayAngle-Math.PI/2),
  //   y: cwW/2+innerR*Math.sin(item.inDays*dayAngle-Math.PI/2)
  // }
  let start = {
    x: cwW/2 + outerR*Math.cos(item.inDays*dayAngle-Math.PI/2),
    y: cwW/2+outerR*Math.sin(item.inDays*dayAngle-Math.PI/2)
  }
  let end = {
    x: cwW/2 + outerR*Math.cos(item.outDays*dayAngle-Math.PI/2),
    y: cwW/2 + outerR*Math.sin(item.outDays*dayAngle-Math.PI/2)
  }

  if(item.numDays==0){
    //Loan length 0 days -> straight line
    path = "M"+start.x+" "+start.y+" L "+end.x+" "+end.y;
  }else{

    let mid = {
      x: 0.5*(start.x+end.x),
      y: 0.5*(start.y+end.y),
      dist: Math.sqrt(Math.pow((0.5*(start.x+end.x)-start.x),2)+Math.pow((0.5*(start.y+end.y)-start.y),2))
    }

    let mid1 = {
      x: 3/4*start.x+1/4*end.x,
      y: 3/4*start.y+1/4*end.y,
      dist: Math.sqrt(Math.pow((3/4*start.x+1/4*end.x-start.x),2)+Math.pow((3/4*start.y+1/4*end.y-start.y),2))
    }

    let mid2 = {
      x: 1/4*start.x+3/4*end.x,
      y: 1/4*start.y+3/4*end.y,
      dist: Math.sqrt(Math.pow((1/4*start.x+3/4*end.x-mid1.x),2)+Math.pow((1/4*start.y+3/4*end.y-mid1.y),2))
    }

    //COMPLEX: double curves
    //TODO: need to be more unique, cannot set angle in stone
   //  path = "M"+start.x+" "+start.y+
   //  " Q "+(start.x+mid1.dist)+" "+(start.y+mid1.dist/Math.sqrt(3))+
   // " , "+(mid.x)+" "+(mid.y)+
   //  " Q "+(mid.x+mid2.dist)+" "+(mid.y+mid2.dist/Math.sqrt(3))+
   //  "  "+end.x+" "+end.y;

    //SIMPLE: curving toward center
    path = "M"+start.x+" "+start.y+
    " Q "+(cwW/2)+" "+(cwH/2)+
    "  "+end.x+" "+end.y;
  }

  return path;
}//getPath


/**************************
* Load data
**************************/
function loadData() {
  //TODO add more datasets
  return Promise.all([
    d3.csv("data/loans.csv")
  ]).then(datasets => {

    datastorage.dates = datasets[0];
    datastorage.dates.forEach(function(d){
      d.id = +d.id;
      d.inDays = +d.inDays;
      d.outDays = +d.outDays;
      d.numDays = +d.numDays;
    })

    //Adjust scales
    widthScale.domain(d3.extent(datastorage.dates, d => d.numDays)).nice();
    opScale.domain(d3.extent(datastorage.dates, d => d.numDays));
    colorScale.domain(d3.extent(datastorage.dates, d => d.numDays));

    return datastorage;
  })
}//loadData

/**************************
* Draw data in window
**************************/
function showData(){

    drawBackground();

    //lines
    svgArea.append("g")
          .attr("id", "lines")
          .selectAll("path")
          .data(datastorage.dates)
          .enter()
          .append("path")
          .attr("d", d => getPath(d))
          .attr("fill","none")
          .attr("stroke", "white")
           .attr("stroke-width", d => widthScale(d.numDays))
          .attr("stroke-opacity", d => opScale(d.numDays))
          .attr("stroke-linecap", "round")

    //Draw months
    drawMonths();

}//showData

function drawBackground(){
  //disc for backgroud
  svgArea.append("circle")
    .attr("cx",cwW/2)
    .attr("cy",cwH/2)
    .attr("r", outerR)
    .attr("stroke","black")
    .attr("fill","black")

}//drawBackground

function drawMonths(){

  let height = 20;
  let point = {
    x: cwW/2,
    y: cwH/2
  }

  for (let i = 0; i < 12; i++) {

    //line between months
    svgArea.append("path")
      .attr("d","M"+(cwW/2 + (outerR)*Math.cos(i*Math.PI/6-Math.PI/2))+" "+(cwH/2 + (outerR)*Math.sin(i*Math.PI/6-Math.PI/2))+" L "+(cwW/2 + (outerR+10)*Math.cos(i*Math.PI/6-Math.PI/2))+" "+(cwW/2 + (outerR+10)*Math.sin(i*Math.PI/6-Math.PI/2)))
      .attr("stroke","black")
      .attr("stroke-width", 2)

    //month numbers
    //update text points
    point.x = cwW/2 + (outerR+20)*Math.cos(Math.PI/6*(i-5/2));
    point.y = cwH/2 + (outerR+20)*Math.sin(Math.PI/6*(i-5/2));

    svgArea.append("text")
      .attr("x", point.x)
      .attr("y", point.y)
      .attr("alignment-baseline", "middle")
      .attr("font-size",18)
      .attr("fill","black")
      .attr("text-anchor","middle")
      .text(i+1)
  }

}//drawMonths


/**************************
* Handling errors
**************************/
function errorHandler(e) {
  console.log("An error occurred");
  console.log(e);
}


//////////////////////////////////
loadData().then(showData).catch(errorHandler)
