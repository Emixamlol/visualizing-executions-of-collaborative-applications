// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';
import { Strategy, } from '../types/d3-framework-types';
import { Message } from '../types/proxy-types';
import { visualization } from './Reusable-blocks';
import { drawObjectCircle } from './Reusable-blocks/object-circle';
import { drawObjectEllipse } from './Reusable-blocks/object-ellipse';
import { strategies } from './Strategies';
// constants
const width = 960;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const svg = d3
    .select('div.visualization > div.visualization-element')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
const vis = visualization()
    .width(width)
    .height(height);
const num = visualization().width();
console.log(svg.node());
svg.call(vis);
const id = 'x';
const payload = ['payload', [0]];
const replica = {
    id,
    state: {
        history: [{ msg: Message.initialized, payload }],
        payload,
        merges: [],
        color: 'blue',
    },
};
const id2 = 'y';
const payload2 = ['payload', [0]];
const replica2 = {
    id: id2,
    state: {
        history: [{ msg: Message.initialized, payload }],
        payload,
        merges: [],
        color: 'green',
    },
};
const data = [
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
    const data = [];
    let visualizer = strategies.get(Strategy.time); // visualizes the data
    const color = d3.scaleOrdinal(d3.schemeCategory10);
};
