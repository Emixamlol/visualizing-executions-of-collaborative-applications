import LWW_Register from './register.js';

const x1 = new LWW_Register();
const x2 = new LWW_Register();
const x3 = new LWW_Register();

const registers = [
  { register: x1, color: 'blue' },
  { register: x2, color: 'brown' },
  { register: x3, color: 'orange' },
];

x2.assign(2);
x3.assign(3);
x1.assign(1);

const merges = [
  { r1: x3, r2: x2 },
  { r1: x3, r2: x1 },
  { r1: x1, r2: x2 },
];

console.log(`X1 = ${x1.value()}`);
console.log(`X2 = ${x2.value()}`);
console.log(`X3 = ${x3.value()}`);

x3.merge(x2);
x3.merge(x1);
x1.merge(x2);

console.log(`X3 = ${merges[0].r1.merge(merges[0].r2).value()}`);
console.log(`X3 = ${merges[1].r1.merge(merges[1].r2).value()}`);
console.log(`X1 = ${merges[2].r1.merge(merges[2].r2).value()}`);

// --------------------------------------------- Visualization ---------------------------------------------

const width = 900;
const height = 400;
const margin = 60;

const svg = d3.select('div#root').append('svg');

svg.attr('width', width);
svg.attr('height', height);

const ellipse = svg.append('g');

ellipse
  .append('path')
  .attr('stroke', 'black')
  .attr('fill', 'none')
  .attr('stroke-dasharray', '10 10')
  .attr('d', 'M 30 200 A 50 200 0 0 1 130 200 A 50 200 0 0 1 30 200');

const circles = svg.append('g');

circles
  .selectAll('circle')
  .data(registers)
  .enter()
  .append('circle')
  .attr('cx', 80)
  .attr('cy', (data, idx) => (idx * height) / registers.length + margin)
  .attr('r', 30)
  .attr('fill', 'none')
  .attr('stroke', (data) => data.color);

const text = circles
  .selectAll('text')
  .data(registers)
  .enter()
  .append('text')
  .attr('x', 70)
  .attr('y', (data, idx) => (idx * height) / registers.length + margin)
  .attr('fill', (data) => data.color)
  .text((data, idx) => 'X' + (idx + 1));

const names = svg.append('g');

names
  .selectAll('text')
  .data(registers)
  .enter()
  .append('text')
  .attr('x', 150)
  .attr('y', (data, idx) => (idx * height) / registers.length + margin)
  .attr('fill', (data) => data.color)
  .text((data, idx) => 'X' + (idx + 1) + '=(0,0)');

const lines = svg.append('g');

lines
  .selectAll('path')
  .data(registers)
  .enter()
  .append('path')
  .attr('stroke', (data) => data.color)
  .attr(
    'd',
    (data, idx) =>
      `M 250 ${(idx * height) / registers.length + margin} l ${width - 250} 0`
  );

lines
  .selectAll('circle')
  .data(registers)
  .enter()
  .append('circle')
  .attr('cx', (data) => 230 + 45 * data.register.timestamp())
  .attr('cy', (data, idx) => (idx * height) / registers.length + margin)
  .attr('r', 10)
  .attr('fill', (data) => data.color);

lines
  .selectAll('text')
  .data(registers)
  .enter()
  .append('text')
  .attr('x', (data) => 230 + 45 * data.register.timestamp())
  .attr('y', (data, idx) => (idx * height) / registers.length + 40)
  .attr('fill', (data) => data.color)
  .text(
    (data, idx) =>
      `X${idx + 1}=(${data.register.value()},${data.register.timestamp()})`
  );

const merge_operations = svg.append('g');

merge_operations
  .selectAll('circle')
  .data(merges)
  .enter()
  .append('circle')
  .attr('cx', (data) => 530 + 35 * data.r1.timestamp())
  .attr('cy', (data, idx) => (idx * height) / merges.length + margin)
  .attr('r', 10)
  .attr('fill', (data) => data.color);
