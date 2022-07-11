// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';
export default class Framework {
    constructor(crdtState) { }
}
const width = 500;
const height = 500;
export const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
