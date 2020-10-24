let data;
document.addEventListener('DOMContentLoaded',() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
        .then(response => response.json())
        .then(json => {
            createGraph(json);
        });
});
function parseTime(time){
    let temp =time.split(':');
    const minutes=temp[0];
    const seconds=temp[1];
    const newTime=  new Date (Date.UTC(70,0,1,5,minutes,seconds,0));
    return newTime;
}
function createGraph(data){
    const h=800;
    const w=1200;
    const padding=60;
    const legendData= [ [450, 10, 'rgba(0, 255, 115, 0.692)'], [650, 10, 'rgba(255, 102, 0, 0.815)']];
    const textData = [[465, 15, 'Doping'], [665, 15, 'No Doping']];
    const xScale= d3.scaleLinear()
                    .domain([d3.min(data, (d) => d.Year-1), d3.max(data, (d) => d.Year+1)])
                    .range([padding, w-padding]);
    const yScale= d3.scaleTime()
                    .domain([d3.min(data, (d) => parseTime(d.Time)), d3.max(data, (d) => parseTime(d.Time))])
                    .range([h-padding, padding])
                    .nice(d3.timeSecond.every(15));
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'));
    const tooltip=d3.select('#graph')
                    .append('div')
                    .attr('id', 'tooltip');
    const legend= d3.select('#title')
                    .append('svg')
                    .attr('id','legend')
                    .attr('width', w)
                    .attr('height', 30);
              legend.selectAll('circle')
                    .data(legendData)
                    .enter()
                    .append('circle')
                    .attr('class', 'legend-dot')
                    .attr('cx', (d) => d[0])
                    .attr('cy', (d) => d[1])
                    .attr('r', 10)
                    .attr('fill', (d) => d[2]);
              legend.selectAll('text')
                    .data(textData)
                    .enter()
                    .append('text')
                    .text((d) => d[2])
                    .attr('class', 'legend-text')
                    .attr('x', (d) => d[0])
                    .attr('y', (d) => d[1])
                    .style('fill', 'white');
        const svg=d3.select('#graph')
                    .append('svg')
                    .attr('height',h)
                    .attr('width', w);
                 svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('class','dot')
                    .attr('data-xvalue', (d) => d.Year)
                    .attr('data-yvalue', (d) => parseTime(d.Time))
                    .attr('cx',(d,i) => xScale(d.Year))
                    .attr('cy',(d,i) => yScale(parseTime(d.Time)))
                    .attr('r', 5)
                    .attr('fill', (d) => (d.Doping ? 'rgba(0, 255, 115, 0.692)' : 'rgba(255, 102, 0, 0.815)'))
                    .on('mouseover', (d)=>{
                        tooltip.html(d.Name + ': ' + d.Nationality +'<br/> Year: ' + d.Year + ' Time: ' + d.Time + ' s<br/><br/>' + (d.Doping ? d.Doping : 'No doping accusations')) 
                               .attr('data-year', d.Year)
                        tooltip.transition()
                               .duration(500)
                               .style('opacity', 9)
                               .style('position','absolute')
                               .style('left', d3.event.pageX + 15 +'px')
                               .style('top', d3.event.pageY-40 + 'px');                                       
                    })
                    .on('mouseout',(d)=> {
                        tooltip.transition()
                               .duration(500)
                               .style('opacity',0);
                    });
                 svg.append('g')
                    .attr('transform','translate (0,'+ (h-padding) + ')')
                    .attr('id','x-axis')
                    .call(xAxis);
                 svg.append('g')
                    .attr('transform', 'translate (' +padding + ',0)')
                    .attr('id', 'y-axis')
                    .call(yAxis);
}


        