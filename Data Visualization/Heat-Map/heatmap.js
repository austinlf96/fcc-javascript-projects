//Sets default size values for non-responsive map
const default_h = 700; 
const default_w = 1700;
const default_ratio = default_w/default_h;
const pad = 60;
const colorTemps= [0.0, 2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
let width = default_w;
let height = default_h;
let jsonData;
document.addEventListener('DOMContentLoaded', () => {
   fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
       .then((response) => response.json())
       .then((json) => {
          jsonData=json;
          createMap(json);
        });
});

//Sets new size values for repsonsive map
function setMapSize(){
   console.log('Resizing map');
   let current_width= window.innerWidth;
   let current_height= window.innerHeight;
   let current_ratio= current_width/current_height;
   let h, w;
   //Check what dimension is limiting map
   if(current_ratio > default_ratio){
       h= current_height;
       w= h * default_ratio;
   } else {
       w=current_width;
       h= w/default_ratio;
   }
   //Reset dimensions based on window dimensions
   width = w;
   height = h;
}

function getColor(variance){
   switch(true){
      case (variance >= 14.0):
         return 'darkred'
      case (variance >= 12.8):
         return 'firebrick';
      case (variance >= 11.7):
         return 'red';
      case (variance >= 10.6):
         return 'orangered';
      case (variance >= 9.5):
         return 'orange';
      case (variance >= 8.3):
         return 'yellow';
      case (variance >= 7.2):
         return 'yellowgreen';
      case (variance >= 6.1):
         return 'lightgreen';
      case (variance >= 5.0):
         return 'cyan';
      case (variance >= 3.9):
         return 'lightskyblue';
      case (variance >= 2.8):
         return 'lightblue';
      case (variance <2.8):
         return 'purple';
      default:
         break;
   }
}
function createDomain(){
   let array=[1753];
   for (let i=1754; i<2016; i++)
   {
      array=array.concat(i);
      
   }
   return array;
}
function createMap(data){
    const baseTemp= data.baseTemperature;
    const xScale= d3.scaleBand()
                    .domain(createDomain())
                    .range([pad, width-pad]);
    const yScale= d3.scaleBand()
                    .domain([0,1,2,3,4,5,6,7,8,9,10,11])
                    .range( [height-pad, pad]);
    const xAxis = d3.axisBottom(xScale)
                    .tickValues(createDomain().filter((d)=> d % 10 ===0));
    const yAxis = d3.axisLeft(yScale)
                    .tickValues([0,1,2,3,4,5,6,7,8,9,10,11])
                    .tickFormat((month) => {
                       let date= new Date(0);
                       date= date.setUTCMonth(month);
                       return d3.utcFormat('%B')(date);
                    });
   const svg= d3.select('#map')
                .append('svg')
                .attr('id','heatmap')
                .attr('width', width)
                .attr('height', height)
                .style('border','2px solid black'); 
   const tooltip=  d3.select('#map')
                     .append('div')
                     .attr('id','tooltip')
                     .style('opacity',0);
             svg.selectAll('rect')
                .data(data.monthlyVariance)
                .enter()
                .append('rect')
                .attr('class', 'cell')
                .attr('data-month', (d) => d.month-1)
                .attr('data-year', (d) => d.year)
                .attr('data-temp', (d) => baseTemp + d.variance)
                .attr('width', 7)
                .attr('height', yScale.bandwidth())
                .attr('x', (d) => xScale(d.year))
                .attr('y', (d) => yScale(d.month-1))
                .attr('fill', (d) => getColor(baseTemp + d.variance))
                .on('mouseover', (d) => {
                  tooltip.html(d.year + '<br/>Temperature: ' + (baseTemp + d.variance).toFixed(2));
                  tooltip.attr('data-year', d.year);
                  tooltip.transition()
                         .duration(10)
                         .style('opacity', 9)
                         .style('position','absolute')
                         .style('left', d3.event.pageX- 55 +'px')
                         .style('top', d3.event.pageY - 70+'px');
                })
                .on('mouseout', (d) => {
                   tooltip.transition()
                          .duration(10)
                          .style('opacity', 0);
                });
             svg.append('g')
                .attr('id','x-axis')
                .attr('class','axis')
                .attr('transform' ,'translate (0,' + (height - pad)+ ')')
                .call(xAxis);
             svg.append('g')
                .attr('id', 'y-axis')
                .attr('class','axis')
                .attr('transform', 'translate (' + pad + ',0)')
                .call(yAxis);
             svg.append('text')
                .attr('id', 'title')
                .attr('x', width/2.2)
                .attr('y', pad/3)
                .text('Global Surface Temperatures');
             svg.append('text')
                .attr('id','description')
                .attr('x', width/2.3)
                .attr('y', pad*.75)
                .text('1753-2015 Base temperature: 8.66 °C ');

   const legend=d3.select('#map')
                  .append('svg')
                  .attr('id','legend')
                  .attr('width', width/2.001)
                  .attr('height', height*.175)
                  .style('border', '2px solid black');
            legend.selectAll('rect')
                  .data(colorTemps)
                  .enter()
                  .append('rect')
                  .attr('class', 'colorCell')
                  .attr('x', (d,i) => (width/22) * i)
                  .attr('y', 22)
                  .attr('width', width/22) 
                  .attr('height', width/22)
                  .attr('fill', (d) => getColor(d));
            legend.selectAll('text')
                  .data(colorTemps)
                  .enter()
                  .append('text')
                  .attr('class','colorAxisText')
                  .attr('x', (d,i) => (width/22) * i - 17)
                  .attr('y', height*.17)
                  .text((d) => d.toFixed(1));

}
let resizeTimer;
window.onresize = (event) => {
   clearTimeout(resizeTimer);
   resizeTimer= setTimeout(()=>{
      let current_map= d3.selectAll('svg');
      current_map=current_map.remove();
      setMapSize();
      createMap(jsonData);
   }, 100);
}