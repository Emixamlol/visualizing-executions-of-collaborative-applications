// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';

import {
  ReplicaInterface,
  Strategy,
  VisualizationInterface,
} from '../types/d3-framework-types';
import { ID, StateInterface } from '../types/proxy-types';
import { strategies } from './Strategies';

// data
const replicas: ReplicaInterface[] = [];
const merges = [];

let drawer: VisualizationInterface = strategies.get(Strategy.time); // visualizes the data

const color = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('width', 960)
  .attr('height', 500);

console.log(svg.node());

// methods which will be invoked by the proxies
export const sendState = (id: ID, state: StateInterface): void => {
  replicas.push({ id, state });
  visualize();
};

export const update = (): void => {
  drawer.update();
};

export const visualize = (): void => {
  // main method: visualizes all the current data
  drawer.visualize(svg, replicas);
};

// ! --------------------------- TO BE DELETED ---------------------------

const width = 1400;
const height = 500;

export const svgtobedeleted = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const n = 100;

// svg
//   .append('g')
//   .selectAll('rect')
//   .data(d3.range(n))
//   .join('rect')
//   .attr('y', (d) => d * 20)
//   .attr('width', width)
//   .attr('height', 10)
//   .attr('mask', 'url(#mask-1)');
// .attr('mask', (d) => (d * 20) 'url(#mask-1)');

svgtobedeleted
  .append('g')
  .selectAll('g')
  .data(d3.range(d3.symbolsFill.length))
  .join((enter) =>
    enter
      .append('g')
      .selectAll('rect')
      .data(d3.range(n))
      .join((enter) =>
        enter
          .append('rect')
          .attr('x', (d) => d * (width / 7))
          .attr('y', (d) => d * 20)
          .attr('width', width / 7)
          .attr('height', 10)
          .attr('mask', (d) => {
            const length = width / 7;
            const x = d * 20;
            const range = (x - (x % length)) / length;
            return range % 2 === 0 ? 'url(#mask-1)' : 'url(#mask-2)';
          })
      )
  );

const renderMask = (
  selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  id: string,
  inverted: boolean
) => {
  const mask = selection.append('mask').attr('id', id);

  mask
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', inverted ? 'black' : 'white');

  // mask
  //   .append('g')
  //   .attr('transform', `translate(${width / 2}, ${height / 2})`)
  //   .append('path')
  //   .attr('d', d3.symbol(d3.symbolsFill[4], 30000)())
  //   .attr('fill', inverted ? 'white' : 'black');

  // const g = mask
  //   .append('g')
  //   .attr('transform', `translate(${width / 2}, ${height / 2})`);
  const [range, symbols] = [d3.range, d3.symbolsFill];

  mask
    .selectAll('g')
    .data(range(symbols.length))
    .join((enter) => {
      console.log(enter);

      return enter
        .append('g')
        .attr('transform', (d) => `translate(${d * 200 + 100}, ${height / 2})`)
        .append('path')
        .attr('d', (d) => d3.symbol(symbols[d], 10000)())
        .attr('fill', (d) => (d % 2 === 0 ? 'black' : 'white'));
      // .attr('fill', inverted ? 'white' : 'black')
    });
};

// renderMask(svg, 'mask-1', true);
// renderMask(svg, 'mask-2', false);

svgtobedeleted
  .call(renderMask, 'mask-1', false)
  .call(renderMask, 'mask-2', true);

svgtobedeleted
  .append('g')
  .selectAll('rect')
  .data(d3.range(n))
  .join('rect')
  .attr('x', (d) => d * 20)
  .attr('width', 10)
  .attr('height', height)
  .attr('mask', 'url(#mask-2)');
// .attr('mask', (d) => {
//   const length = width / 7;
//   const x = d * 20;
//   const range = (x - (x % length)) / length;
//   return range % 2 === 0 ? 'url(#mask-1)' : 'url(#mask-2)';
// });

const rangeWidth = 200;
const x = 401;
const range = (x - (x % rangeWidth)) / rangeWidth;
console.log(x, range);

// ! --------------------------- TO BE DELETED ---------------------------
