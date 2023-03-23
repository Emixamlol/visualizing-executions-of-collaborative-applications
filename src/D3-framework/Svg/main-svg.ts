import * as d3 from 'd3';
import { visualizeCRDT } from '../../Proxy';

import { Data } from '../../types/d3-framework-types';
import { drawBasicState } from './../Reusable-blocks/basic-state';
import { drawObjectCircle } from './../Reusable-blocks/object-circle';
import { drawObjectEllipse } from './../Reusable-blocks/object-ellipse';
import { drawTimeLine } from './../Reusable-blocks/timeline';

const visualizationDiv = document.getElementById('visualization');
const dimensions = visualizationDiv.getBoundingClientRect();

// constants
const width = dimensions.width / 2; //960;
const height = dimensions.height; //700;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const radius = 25;
const svgClass = 'general-svg';

const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization')
  .append('svg')
  .attr('id', svgClass)
  .attr('class', svgClass)
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
  .on('click', (id) => {
    console.log(`clicked on circle ${id}`);
    visualizeCRDT(id);
  })
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
