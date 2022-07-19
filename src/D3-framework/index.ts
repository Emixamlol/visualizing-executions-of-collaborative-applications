// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';
import { payload } from '../types/crdt-types';

import {
  Data,
  Strategy,
  ReusablePatternInterface,
  VisualizationInterface,
  ReplicaInterface,
} from '../types/d3-framework-types';
import { ID, Message, StateInterface } from '../types/proxy-types';
import { visualization } from './Reusable-blocks';
import { drawObjectCircle } from './Reusable-blocks/object-circle';
import { drawObjectEllipse } from './Reusable-blocks/object-ellipse';
import { strategies } from './Strategies';

// constants
const width = 960;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const vis: ReusablePatternInterface = visualization()
  .width(width)
  .height(height);

const num: number = visualization().width();

console.log(svg.node());

svg.call(vis);

const id: ID = 'x';
const payload: payload = ['payload', [0]];
const replica: ReplicaInterface = {
  id,
  state: {
    history: [{ msg: Message.initialized, payload }],
    payload,
    merges: [],
    color: 'blue',
  },
};

const id2: ID = 'y';
const payload2: payload = ['payload', [0]];
const replica2: ReplicaInterface = {
  id: id2,
  state: {
    history: [{ msg: Message.initialized, payload }],
    payload,
    merges: [],
    color: 'green',
  },
};

const data: Data = [
  [id, [replica, replica, replica, replica, replica]],
  [id2, [replica2]],
];

const objectEllipse = drawObjectEllipse()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data);

const objectCircle = drawObjectCircle()
  .width(width)
  .height(height)
  .margin(margin)
  .data(data);

svg.call(objectEllipse).call(objectCircle);

// Framework
export const main = () => {
  const data: Data = [];

  let visualizer: VisualizationInterface = strategies.get(Strategy.time); // visualizes the data

  const color = d3.scaleOrdinal(d3.schemeCategory10);
};
