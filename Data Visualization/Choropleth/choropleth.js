//Sets default size values for non-responsive map
const default_h = 700; 
const default_w = 1000;
const default_ratio = default_w/default_h;
const pad = 60;
let width = default_w;
let height = default_h;


const educationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let promises = [d3.json(educationData), d3.json(countyData)];
Promise.all(promises)
    .then((values) => createChoropleth(values));
function createChoropleth(jsonData) {
    const color= d3.scaleThreshold()
        .domain([3,12,21,30,39,48,57,66])
        .range(["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
    let eduData= d3.map(jsonData[0], ({fips}) => [fips]);
    d3.select('#choropleth')
        .append('div')
        .attr('id','title')
        .text('United States Educational Achievement');
    d3.select('#choropleth')    
        .append('div')
        .attr('id','description')
        .text('Percentage of adults age 25+ with bachelor\'s degree of higher (2010-2014)');
    const svg= d3.select('#choropleth')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    const tooltip=  d3.select('#choropleth')
        .append('div')
        .attr('id','tooltip')
        .style('opacity',0);
    svg.append('g')
        .attr('id','legend')
        .attr('transform', 'translate(' + width*.55 + ',' + (height-pad*1.5)+')')
        .append(() => legend({color, title: 'Bachelors Degree or Higher (%)',tickSize: 0 }));
    svg.append('g')
        .attr('id','counties')
        .selectAll('path')
        .data(topojson.feature(jsonData[1], jsonData[1].objects.counties).features)
        .join('path')
          .attr('class','county')
          .attr('d',d3.geoPath())
          .attr('fill', (d) => color(eduData.get(d.id).bachelorsOrHigher))
          .attr('data-fips', (d) => d.id)
          .attr('data-education', (d) => eduData.get(d.id).bachelorsOrHigher)
          .on('mouseover', (d) => {
            tooltip.html(eduData.get(d.id).area_name +', '+ eduData.get(d.id).state + '<br/>' + eduData.get(d.id).bachelorsOrHigher + '%');
            tooltip.attr('data-education', eduData.get(d.id).bachelorsOrHigher);
            tooltip.transition()
              .duration(10)
              .style('opacity', 9)
              .style('position','absolute')
              .style('left', d3.event.pageX + 10 +'px')
              .style('top', d3.event.pageY -15 +'px');
          })
          .on('mouseout', (d) => {
            tooltip.transition()
              .duration(10)
              .style('opacity', 0);
          })
        .append('title')
          .text((d) => eduData.get(d.id).area_name +', '+ eduData.get(d.id).state + ' : ' + eduData.get(d.id).bachelorsOrHigher);

    svg.append('path')
        .datum(topojson.mesh(jsonData[1], jsonData[1].objects.states, (a,b) => a !== b))
        .attr('fill','none')
        .attr('stroke','black')
        .attr('stroke-linejoin', 'round')
        .attr('d', d3.geoPath());
    svg.append('path')
        .datum(topojson.mesh(jsonData[1], jsonData[1].objects.nation))
        .attr('fill', 'none')
        .attr('stroke','black')
        .attr('stroke-linejoin','round')
        .attr('d', d3.geoPath());
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
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

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
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

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

  return svg.node();
}
