import * as d3 from 'd3';

import { Data } from '../../types/d3-framework-types';
import { drawBasicState } from './../Reusable-blocks/basic-state';
import { drawObjectCircle } from './../Reusable-blocks/object-circle';
import { drawObjectEllipse } from './../Reusable-blocks/object-ellipse';
import { drawTimeLine } from './../Reusable-blocks/timeline';

// constants
const width = 500;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 0 };
const data: Data = [];
const radius = 25;

const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const objectCircle = drawObjectCircle()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data)
  .radius(radius);

svg.call(objectCircle);
console.log(svg.node().getClientRects());

export const drawSpecificCircles = (data: Data): void => {
  svg.call(objectCircle.data(data));
};
