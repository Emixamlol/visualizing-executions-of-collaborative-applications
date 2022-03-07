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
  { r1: x3, r2: x2, position: 500 },
  { r1: x3, r2: x1, position: 640 },
  { r1: x1, r2: x2, position: 640 },
];

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

const merge_operations = svg
  .append('g')
  .selectAll('circle')
  .data(merges)
  .enter();

merge_operations
  .append('circle')
  .attr('cx', (data) => data.position)
  .attr(
    'cy',
    (data) => ((data.r2.value() - 1) * height) / merges.length + margin
  )
  .attr('r', 10)
  .attr('fill', (data) => {
    for (let obj in registers) {
      const { register, color } = registers[obj];
      if (data.r2 === register) return color;
    }
  });

merge_operations
  .append('circle')
  .attr('cx', (data) => data.position + 100)
  .attr(
    'cy',
    (data) => ((data.r1.value() - 1) * height) / merges.length + margin
  )
  .attr('r', 10)
  .attr('fill', (data) => {
    for (let obj in registers) {
      const { register, color } = registers[obj];
      if (data.r1 === register) return color;
    }
  });

merge_operations
  .append('path')
  .attr('stroke', 'grey')
  .attr('d', (data) => {
    return `M ${data.position} ${
      ((data.r2.value() - 1) * height) / merges.length + margin
    } L ${data.position + 100} ${
      ((data.r1.value() - 1) * height) / merges.length + margin
    }`;
  });

merge_operations
  .append('text')
  .attr('x', (data) => data.position + 100)
  .attr(
    'y',
    (data) => ((data.r1.value() - 1) * height) / merges.length + margin + 30
  )
  .text((data, idx) => {
    const { r1, r2 } = data;
    return `X${r1.value()}=(${r1.merge(r2).value()},${r1
      .merge(r2)
      .timestamp()})`;
  });
