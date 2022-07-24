import * as d3 from 'd3';
import { getStartYs, getTimelineCoordinates } from './data-processing';
export const drawTimeLine = () => {
    let width;
    let height;
    let margin;
    let data;
    const my = (selection) => {
        // set scales
        const x = margin.left * 9;
        const replicas = data
            .map(([id, replicas]) => replicas.map((replica) => replica.id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const t = d3.transition().duration(1000);
        // process data
        const startYs = getStartYs(data, margin);
        const timelineCoordinates = getTimelineCoordinates(data, startYs, margin);
        // visualization
        const htmlClass = 'timeline';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        g.selectAll('path')
            .data(timelineCoordinates)
            .join((enter) => enter
            .append('path')
            .attr('transform', `translate(0, 0)`)
            .attr('stroke', (d) => colorScale(d.id))
            .attr('d', (d) => `M ${x} ${d.y} l 0 0`)
            .call((enter) => enter.transition(t).attr('d', (d) => {
            return `M ${x} ${d.y} l ${d.lineLength} 0`;
        })), (update) => update
            .attr('transform', `translate(0, 0)`)
            .attr('stroke', (d) => colorScale(d.id))
            .call((enter) => enter.transition(t).attr('d', (d) => {
            return `M ${x} ${d.y} l ${d.lineLength} 0`;
        })));
    };
    my.width = function (_) {
        return arguments.length ? ((width = _), my) : width;
    };
    my.height = function (_) {
        return arguments.length ? ((height = _), my) : height;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    return my;
};
