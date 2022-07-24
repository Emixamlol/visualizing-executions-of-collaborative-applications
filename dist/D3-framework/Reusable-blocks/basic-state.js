import * as d3 from 'd3';
import { getCircleCoordinates, getLineCoordinates, getStartYs, getSymbolCoordinates, } from './data-processing';
export const drawBasicState = () => {
    let width;
    let height;
    let margin;
    let data = [];
    let radius;
    const my = (selection) => {
        // set scales
        const x = margin.left * 9;
        const xScale = d3
            .scaleLinear()
            .domain([0, history.length])
            .range([x, x + history.length * 125]);
        const replicas = data
            .map(([, replicas]) => replicas.map((replica) => replica.id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const t = d3.transition().duration(1000);
        // process data
        const startYs = getStartYs(data, margin);
        const circleCoordinates = getCircleCoordinates(data, startYs, margin);
        const symbolCoordinates = getSymbolCoordinates(data, startYs, margin);
        const lineCoordinates = getLineCoordinates(data, startYs, margin);
        // visualization
        const htmlClass = 'basic-state';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        // --------------------------------- circles ---------------------------------
        const positionCircles = (circles) => {
            circles.attr('cx', (d) => d.cx).attr('cy', (d) => d.cy);
        };
        const colorCircles = (circles) => {
            circles
                .attr('r', radius)
                .attr('fill', (d) => colorScale(d.replicaId))
                .attr('stroke', (d) => colorScale(d.replicaId));
        };
        g.selectAll('circle')
            .data(circleCoordinates)
            .join((enter) => enter
            .append('circle')
            .call(positionCircles)
            .attr('r', 0)
            .call((enter) => enter.transition(t).call(colorCircles))
            .append('title')
            .text((d) => d.title), (update) => update
            .call(positionCircles)
            .call(colorCircles)
            .select('title')
            .text((d) => d.title));
        // --------------------------------- symbols ---------------------------------
        const positionSymbols = (path) => {
            path
                .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
                .attr('fill', 'white')
                .attr('d', d3.symbol(d3.symbolsFill[4], 150)());
        };
        const colorSymbols = (path) => {
            path
                .attr('fill', (d) => colorScale(d.replicaId))
                .attr('stroke', (d) => colorScale(d.replicaId));
        };
        g.selectAll('path')
            .data(symbolCoordinates)
            .join((enter) => enter
            .append('path')
            .call(positionSymbols)
            .call((enter) => enter.transition(t).call(colorSymbols))
            .append('title')
            .text((d) => d.title), (update) => update
            .call(positionSymbols)
            .call(colorSymbols)
            .select('title')
            .text((d) => d.title));
        // --------------------------------- lines ---------------------------------
        const positionLines = (line, x_2, y_2) => {
            line
                .attr('x1', (d) => d.x_1)
                .attr('y1', (d) => d.y_1)
                .attr('x2', (d) => d[x_2])
                .attr('y2', (d) => d[y_2]);
        };
        g.selectAll('line')
            .data(lineCoordinates)
            .join((enter) => enter
            .append('line')
            .attr('stroke', 'black')
            .call(positionLines, 'x_1', 'y_1')
            .transition(t)
            .call(positionLines, 'x_2', 'y_2'), (update) => update.call(positionLines, 'x_2', 'y_2'));
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
    my.radius = function (_) {
        return arguments.length ? ((radius = _), my) : radius;
    };
    return my;
};
