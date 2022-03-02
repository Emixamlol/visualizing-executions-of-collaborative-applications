import LWW_Register from './register.js';

const x1 = new LWW_Register();
const x2 = new LWW_Register();
const x3 = new LWW_Register();

const registers = [x1, x2, x3];

x2.assign(2);
x3.assign(3);
x1.assign(1);

console.log(`X1 = ${x1.value()}`);
console.log(`X2 = ${x2.value()}`);
console.log(`X3 = ${x3.value()}`);

x3.merge(x2);
x3.merge(x1);
x1.merge(x2);

console.log(`X3 = ${x3.merge(x2).value()}`);
console.log(`X3 = ${x3.merge(x1).value()}`);
console.log(`X1 = ${x1.merge(x2).value()}`);

// --------------------------------------------- Visualization ---------------------------------------------

const width = 900;
const height = 400;

const svg = d3.select('div#root').append('svg');

svg.attr('width', width);
svg.attr('height', height);

const ellipse = svg
  .append('g')
  .append('ellipse')
  .attr('cx', 80)
  .attr('cy', 200)
  .attr('rx', 50)
  .attr('ry', height / registers.length + 50);

const circles = svg
  .append('g')
  .selectAll('circle')
  .data(registers)
  .enter()
  .append('circle')
  .attr('cx', 80)
  .attr('cy', (data, idx) => (idx * height) / registers.length + 50)
  .attr('r', 30)
  .attr('fill', 'yellow')
  .attr('stroke', 'black');

const lines = svg
  .append('g')
  .selectAll('path')
  .data(registers)
  .enter()
  .append('path')
  .attr('stroke', 'blue')
  .attr(
    'd',
    (data, idx) =>
      `M 150 ${(idx * height) / registers.length + 50} l ${width - 150} 0`
  );
