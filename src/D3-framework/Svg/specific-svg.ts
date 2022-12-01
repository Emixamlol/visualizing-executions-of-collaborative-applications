import * as d3 from 'd3';

import { Data } from '../../types/d3-framework-types';
import { ID } from '../../types/proxy-types';
import { flag } from '../Reusable-blocks/Patterns/flag';

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

// TODO refactor: methods to be exported
const drawFlag = (enabled: boolean) => {
  const Flag = flag()
    .width(width)
    .height(height)
    .margin(margin)
    .enabled(enabled);

  console.log('svg calling Flag');

  svg.call(Flag);
};

export { drawFlag };
