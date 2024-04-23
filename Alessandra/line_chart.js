const margin = { top: 70, right: 30, bottom: 60, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

// Scaling my Xs and Ys

const x = d3.scaleLinear()
  .range([0, width]);

const y = d3.scaleLinear()
  .domain(0,50)
  .range([height, 0]);

// The line generator

const line = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.Count));

// Setting up the svg

const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Creating the tooltip div

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// Creating my data

const data = [
    {Year: 1991, Count:	1},
    {Year: 1993, Count:	2},
    {Year: 1996, Count: 1},
    {Year: 1998, Count:	1},
    {Year: 2000, Count:	3},
    {Year: 2003, Count:	1},
    {Year: 2004, Count:	1},
    {Year: 2005, Count:	2},
    {Year: 2007, Count:10},
    {Year: 2008, Count:	3},
    {Year: 2009, Count:	6},
    {Year: 2010, Count:	12},
    {Year: 2011, Count:	4},
    {Year: 2012, Count:	9},
    {Year: 2013, Count:	23},
    {Year: 2014, Count:	16},
    {Year: 2015, Count:	45},
    {Year: 2016, Count:	27},
    {Year: 2017, Count:	16},
    {Year: 2018, Count:	3},
    ];

// Setting up the domain for x and y

x.domain(d3.extent(data, d => d.Year));
y.domain([0, d3.max(data, d => d.Count)]);

// Adding x axis

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .style("font-size", "14px")
  .call(d3.axisBottom(x)
  .tickFormat(d3.format("d")))
  .selectAll(".tick line")
  .style("stroke-opacity", 0)
  svg.selectAll(".tick text")
  .attr("fill", "#777");

// Adding y axis

svg.append("g")
  .style("font-size", "14px")
  .call(d3.axisLeft(y)
  .ticks(10)
  .tickSize(0)
  .tickPadding(10))
  .selectAll(".tick text")
  .style("fill", "#777");

// Adding y axis label

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/ 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("fill", "#777")
  .style("font-family", "sans-serif")
  .text("Total Count");


// Adding x axis label

svg.append("text")
  .attr("y", height + margin.bottom -20)
  .attr("x", width/ 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("fill", "#777")
  .style("font-family", "sans-serif")
  .text("Years");

// Creating gridlines

svg.selectAll("yGrid")
  .data(y.ticks(10))
  .join("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", d => y(d))
  .attr("y2", d => y(d))
  .attr("stroke", "#e0e0e0")
  .attr("stroke-width", .5)

// Adding line path

const path = svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "rgb(52, 107, 169)")
  .attr("stroke-width", 1)
  .attr("d", line);

// Adding a circle element

const circle = svg.append("circle")
  .attr("r", 0)
  .attr("fill", "rgb(52, 107, 169)")
  .style("stroke", "white")
  .attr("opacity", .70)
  .style("pointer-events", "none");

// Creating a listening rectangle

const listeningRect = svg.append("rect")
.attr("width", width)
.attr("height", height);

// Creating mouse move function

listeningRect.on("mousemove", function (event) {
  const [xCoord] = d3.pointer(event, this);
  const bisectYear = d3.bisector(d => d.Year).left;
  const x0 = x.invert(xCoord);
  const i = bisectYear(data, x0, 1);
  const d0 = data[i - 1];
  const d1 = data[i];
  const d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
  const xPos = x(d.Year);
  const yPos = y(d.Count);


  // Setting the circle position

  circle.attr("cx", xPos)
    .attr("cy", yPos)
    .attr("r",5);

  // Adding the tooltip

  tooltip
    .style("display", "block")
    .style("left", `${xPos + 100}px`)
    .style("top", `${yPos + 50}px`)
    .html(`<strong>Year:</strong> ${d.Year}<br><strong>Count:</strong> ${d.Count !== undefined ? (d.Count).toFixed(0): 'N/A'}`)
});

// Leaving the listening rectangle 

listeningRect.on("mouseleave", function () {
  tooltip.style("display", "none");
  circle.attr("r",0)
});

// Adding the Graph title

svg.append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left - 120)
    .attr("y", margin.top - 105)
    .style("font-size", "24px")
    .style("font-family", "sans-serif")
    .text("Rose Crested Blue Pipits Count Over The Years");