const VIDEO_GAME_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
const MOVIE_SALES_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
const KICKSTARTER_PLEDGES = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
const promises= [d3.json(VIDEO_GAME_FILE), d3.json(MOVIE_SALES_FILE), d3.json(KICKSTARTER_PLEDGES)];
Promise.all(promises)
    .then((files) => {
        jsons=files;
        createTreemap(files);
    });
//Sets default size values for non-responsive map
const default_h = 570; 
const default_w = 960;
const default_ratio = default_w/default_h;
const pad = 40;
let width = default_w;
let height = default_h;
/*
//Sets new size values for repsonsive map
function setTreemapSize(){
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
let resizeTimer;
window.onresize = (event) => {
    clearTimeout(resizeTimer);
    resizeTimer= setTimeout(()=>{
        let current_map= d3.selectAll('svg');
        current_map=current_map.remove();
        setTreemapSize();
        createTreemap(jsons, treeNum);
    }, 100);
}
*/
function randomColorGenerator(numberOfColors){
    let colors = [...Array(numberOfColors)];
    for(let i=0; i<colors.length; i++)
    {
        let randomColor ='#000000'.replace(/0/g, () =>  Math.floor(Math.random()*16).toString(16));
        colors[i] = randomColor;
    }
    return colors;
}
function isDark(color) {
    // Function credit to Andreas Wik
    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {
        return false;
    } 
    else {
        return true;
    }
}
function switchTree(treeData, nextTreeNum){
    let text = d3.selectAll('p');
    let svgs= d3.selectAll('svg');
    let buttons= d3.select('#tree-buttons');
    let tip= d3.select('#tolltip');
    text.remove();
    svgs.remove();
    tip.remove();
    buttons.remove();
    createTreemap(treeData, nextTreeNum);
}
function createTreemap(json, treeNumber=0){
    const gameTitle = 'Video Game Sales';
    const movieDescription = 'Box Office Sales';
    const kickstarterDescription = 'Number of Pledges By Category';
    let colors= randomColorGenerator(json[treeNumber].children.length);
    let treeNum=treeNumber;
    color= d3.scaleOrdinal(colors);
    const buttons= d3.select('#tabs')
        .append('div')
        .style('border', '2px solid white')
        .attr('id','tree-buttons');
    buttons.selectAll('button')
        .data(json)
        .enter()
        .append('button')
        .on('click', (d,i) => switchTree(json, i))
        .text((d,i) => json[i].name);
    d3.select('#headings')
        .append('p')
        .attr('id','title')
        .style('font-size', '2.5rem')
        .style('text-decoration', 'underline')
        .text(treeNumber === 0 ? gameTitle : json[treeNumber].name);
    d3.select('#headings')
        .append('p')
        .attr('id', 'description')
        .style('font-size','1.5rem')
        .text(treeNumber===0 ? json[treeNumber].name
            : (treeNumber === 1) ? movieDescription
            : kickstarterDescription); 
    const svg =d3.select('#treemap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    const legendSvg= d3.select('#treemap')
        .append('svg')
        .attr('width', width/2)
        .attr('height', height);
    const tooltip = d3.select('body')
        .append('div')
        .attr('id','tooltip')
        .style('border', '2px solid black')
        .style('opacity', 0);
    let treemap= d3.treemap()
        .size([width-pad, height-pad])
        .round(true)
        .padding(2);
    let data= d3.hierarchy(json[treeNumber])
        .sum((d) => d.value)
        .sort((a,b) => b.value-a.value);
    let root= treemap(data);
    let nodes = root.descendants();
    let leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
            .attr('transform', (d) => 'translate (' + (d.x0 + pad/2) + ',' + (d.y0 + pad/2) + ')')
            .style('border','2px solid black');
    leaf.append('rect')
        .attr('class','tile')
        .attr('id', (d) => d.data.id = d.data.name.toLowerCase().replace(/ /g,'-'))
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('fill', (d) => color(d.data.category))
        .attr('overflow', 'hidden')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .on('mouseover', (d) => {
            tooltip.html(d.data.name + '<br/> System: ' + d.data.category + '<br/> Value: ' + d.data.value);
            tooltip.attr('data-value', d.data.value);
            tooltip.transition()
                .duration(10)
                .style('opacity', 9)
                .style('position','fixed')
                .style('top', pad*3.25 + 'px')
                .style('left', width*.771 + 'px');
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .duration(10)
                .style('opacity', 0);
        });
    leaf.append('text')
        .attr('fill', (d) => isDark(color(d.data.category)) ? 'white' : 'black')
      .selectAll('tspan')
        .data((d) => d.data.name.split(/(?=[A-Z][a-z])/g))
        .enter()
        .append('tspan')
            .attr('x', 3)
            .attr('y', (d, i) => 13 + i * 10)
            .text((d) => d);
    legendSvg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate (0,'+ (height/5) +')')
        .append(() => legend({
            color: d3.scaleOrdinal(color.domain(), color.range()),
            width: width,
            height: height/9
        }));
}
function legend({
    color,
    title,
    tickSize = 6,
    width = 320, 
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
    const svg = d3.create("svg")
        .attr('id','legend-box')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible");
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  
    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  
    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy()
          .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
          {range() { return [marginLeft, width - marginRight]; }});
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  
    // Threshold
    else if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() // scaleQuantize
          : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr('class','legend-item')
          .attr("x", (d,i) => (90*(i%5)))
          .attr("y", (d,i) => marginTop + (Math.floor(i/5) % 5) * 100)
          .attr("width", Math.max(0, x.bandwidth() - 1)+20)
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", color);
      svg.append('g')
        .selectAll('text')
        .data(color.domain())
        .join('text')       
          .attr("x", (d,i) => (90*(i%5))+10)
          .attr("y", (d,i) => marginTop + (Math.floor(i/5) % 5) * 100+45)
          .attr('fill','white')
          .style('font-size','.75rem')
          .text((d) => d);
  
      tickAdjust = () => {};
    }
    /*
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(title));
    */
    return svg.node();
  }