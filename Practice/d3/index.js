/*  
    examples taken from d3 tutorial by freeCodeCamp.org
    source: https://www.youtube.com/watch?v=C4t6qfHZ6Tw&list=PLee96XBF3UtuOHagD-SxtXP3QI2ERrc34
*/

// Selection and Manipulation
d3.select('h1').style('color', 'red').attr('class', 'heading');

d3.select('div#root>p')
  .append('p')
  .text(
    'The state-based "Last-Writer-Wins Register" and "2P set" are the next CRDTs to implement'
  );

d3.selectAll('p').style('color', 'blue');

// Data Loading and Binding

const datasetA = [1, 2, 3, 4, 5];

d3.select('div#root')
  .selectAll('p')
  .data(datasetA)
  .enter()
  .append('p')
  .text((d) => d);

// Creating a simple Bar Chart

const datasetB = [80, 100, 56, 120, 180, 30, 40, 120, 160];

const svgWidth = 500,
  svgHeight = 300,
  barPadding = 5;
const barWidth = svgWidth / datasetB.length;

const svg = d3.select('svg').attr('width', svgWidth).attr('height', svgHeight);

const barChart = svg.selectAll;

// Creating Labels

// Scales

// Axes

// SVG elements

// Creating a Pie Chart

// Line Charts
