
//XMLHttpRequest() Method of retreiving a JSON
/*
const req = new XMLHttpRequest();
req.open('GET','https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
req.send();
const data= req.onload(() => {
    const json= JSON.parse(req.responseText);
    return json;
});
*/

//JavaScript fetch method of retreiving a JSON
/*
const json= JSON.parse(req.responseText);
                    data =[...json.data];
                    const dateSeconds= new Date(data[0][0]).getTime();
                    const dateEndSec= new Date(data[data.length-1][0]).getTime();
                    console.log(dateSeconds + '\n' + dateEndSec);
                    console.log(data);

                    //Successfully loaded json.data, next step is formatting SVG and bar graph. 
                    //Just keep swimming. 
                    const w=1200;
                    const h=700;     
                    const padding=50;        
                    
                    const xScale=d3.scaleTime()
                                   .domain([d3.min(data, (d)=> new Date(d[0])), d3.max(data, (d) => new Date(d[0]))])
                                   .range([padding, w-padding]);
                    const xAxis= d3.axisBottom(xScale);
                    const yScale=d3.scaleLinear()
                                   .domain([0,d3.max(data,(d)=>d[1])])
                                   .range([padding,h-padding]);
                    const yAxis= d3.axisLeft(yScale);
                    const svg=d3.select('body')
                                .append('svg')
                                .attr('height', h)
                                .attr('width', w)
                                .style('border', '2px solid black');
                             svg.select('title')
                                .append('title')
                                .attr('id', 'title')
                                .text("I'm a bar graph leedle leedle leedle");
                             svg.selectAll('rect')
                                .data(data)
                                .enter()
                                .append('rect')
                                .attr('class', 'bar')
                                .attr('fill','blue')
                                .attr('data-date', (d)=> d[0])
                                .attr('data-gdp',(d)=> d[1])
                                .attr('x', (d,i)=> xScale(new Date(d[0])-3))
                                .attr('y', (d,i)=> h - padding - (yScale(d[1])))
                                .attr('height', (d)=> yScale(d[1]))
                                .attr('width', 3);
                             svg.append('g')
                                .attr('transform', 'translate(0,'+ (h-padding) + ')')
                                .call(xAxis);
                             svg.append('g')
                                .attr('transform', 'translate('+padding +',0)')
                                .call(yAxis);
*/