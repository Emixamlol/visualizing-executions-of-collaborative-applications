// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';
import { Strategy, } from '../types/d3-framework-types';
import { Message } from '../types/proxy-types';
import { drawBasicState } from './Reusable-blocks/basic-state';
import { drawObjectCircle } from './Reusable-blocks/object-circle';
import { drawObjectEllipse } from './Reusable-blocks/object-ellipse';
import { drawTimeLine } from './Reusable-blocks/timeline';
import { strategies } from './Strategies';
// constants
const width = 960;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const radius = 25;
const svg = d3
    .select('div.visualization > div.visualization-element')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
console.log(svg.node());
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
    [id, [replica, replica, replica]],
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
    .data(data)
    .radius(radius);
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
setTimeout(() => {
    const newData = data.map(([id, replicas]) => [
        id,
        replicas.concat(replica),
    ]);
    svg
        .call(objectEllipse.data(newData))
        .call(objectCircle.data(newData))
        .call(timeLine.data(newData))
        .call(basicState.data(newData));
    setTimeout(() => {
        svg
            .call(objectEllipse.data(data))
            .call(objectCircle.data(data))
            .call(timeLine.data(data))
            .call(basicState.data(data));
    }, 3000);
}, 2000);
// Framework
export const main = () => {
    const data = [];
    let visualizer = strategies.get(Strategy.time); // visualizes the data
    const color = d3.scaleOrdinal(d3.schemeCategory10);
};
