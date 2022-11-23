import * as d3 from 'd3';

import { Data } from '../../types/d3-framework-types';
import { drawBasicState } from './../Reusable-blocks/basic-state';
import { drawObjectCircle } from './../Reusable-blocks/object-circle';
import { drawObjectEllipse } from './../Reusable-blocks/object-ellipse';
import { drawTimeLine } from './../Reusable-blocks/timeline';

// constants
const width = 960;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const radius = 25;

const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const data: Data = [];

const objectEllipse = drawObjectEllipse()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data);

const objectCircle = drawObjectCircle()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data)
  .radius(radius)
  .on('mouseenter', (id) => {
    console.log(`entered circle ${id}`);
  })
  .on('mouseout', (id) => {
    console.log(`exited circle ${id}`);
  });

const timeLine = drawTimeLine()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data);

const basicState = drawBasicState()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data)
  .radius(radius / 5);

svg.call(objectEllipse).call(objectCircle).call(timeLine).call(basicState);

export const update = (data: Data): void => {
  svg
    .call(objectEllipse.data(data))
    .call(objectCircle.data(data))
    .call(timeLine.data(data))
    .call(basicState.data(data));
};
