import TwoPhase_Set from './set.js';

const A = new TwoPhase_Set();
const B = new TwoPhase_Set();

const letters = ['a', 'b', 'c'];

const width = 1200;
const height = 900;
const margin = 80;
const x_pos = width / 2 + margin;

const svg = d3.select('div#root').append('svg');

svg.attr('width', width);
svg.attr('height', height);

const rectangle = svg.append('g');

rectangle
  .append('rect')
  .attr('x', width / 2)
  .attr('y', height / 6)
  .attr('width', width / 6)
  .attr('height', width / 6)
  .style('fill', 'yellow')
  .style('stroke', 'black');

const operations = [
  { op: 'add', el: 'a' },
  { op: 'add', el: 'b' },
  { op: 'remove', el: 'a' },
  { op: 'add', el: 'c' },
  { op: 'add', el: 'b' },
  { op: 'add', el: 'a' },
];

const elements = svg.append('g');

elements
  .selectAll('text')
  .data(letters)
  .enter()
  .append('text')
  .attr('x', (data, idx) => width / 2 + idx * 90)
  .attr('y', (data, idx) => 170 + idx * 70)
  .attr('font-size', 'x-large')
  .attr('id', (data) => data);

rectangle
  .selectAll('text')
  .data(operations)
  .enter()
  .append('text')
  .attr('x', x_pos)
  .attr('y', (data, idx) => 395 + idx * 30);

rectangle
  .selectAll('text')
  .transition()
  .delay((data, idx) => 1000 + idx * 1000)
  .text((data, idx) => {
    const { op, el } = data;
    setTimeout(() => {
      switch (op) {
        case 'add':
          A.add(el);
          break;
        case 'remove':
          A.remove(el);
          break;
        default:
      }
      elements
        .select(`text#${el}`)
        .text('test')
        .attr('fill', (data) => {
          if (A.lookup(el)) {
            return 'black';
          } else;
          return 'red';
        })
        .text(el);
    }, 1000 + idx * 1000);
    return `${op} (${el})`;
  });

rectangle
  .append('text')
  .attr('x', width / 2 + width / 6)
  .attr('y', width / 6)
  .attr('font-size', 'xxx-large')
  .text('A');

rectangle
  .append('text')
  .attr('x', width / 2 + width / 6)
  .attr('y', width / 4)
  .attr('font-size', 'xxx-large')
  .style('fill', 'red')
  .text('R');
