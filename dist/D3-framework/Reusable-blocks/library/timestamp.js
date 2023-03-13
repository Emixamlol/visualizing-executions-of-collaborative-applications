import * as d3 from 'd3';
import { getStartYs } from '../../data-processing';
export const timestamp = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data = [];
    let timestamp;
    const my = (selection) => {
        // set scales
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const x = margin.left * 2 + 100;
        // process data
        const startYs = getStartYs(data, margin);
        const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
        const startHeights = data
            .map(([, replicas], dataIndex) => replicas.map((d, replicaIndex) => startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex))
            .flat();
        const y = startHeights.at(index);
        // visualization
        const htmlClass = 'crdt-timestamp';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        // label
        const labelx = margin.left * 2 + 50;
        g.selectAll(`text.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('x', labelx)
            .attr('y', y)
            .text(`${replicaId} : `));
        // rest
        const bandScale = d3
            .scaleBand()
            .domain(d3.range(timestamp.length).map((val) => val.toString()))
            .range([100, 300])
            .paddingInner(0.05);
        const yScale = d3
            .scaleLinear()
            .domain([Math.min(...timestamp), Math.max(...timestamp)])
            .range([5, 20]);
        g.selectAll('rect')
            .data(timestamp)
            .join('rect')
            .attr('class', htmlClass)
            .attr('x', (d, i) => x + bandScale(i.toString()))
            .attr('y', y)
            .attr('height', (d) => {
            console.log(d);
            return yScale(d);
        })
            .attr('width', bandScale.bandwidth())
            .attr('fill', colorScale(replicaId));
    };
    my.x = function (_) {
        return arguments.length ? ((x = _), my) : x;
    };
    my.y = function (_) {
        return arguments.length ? ((y = _), my) : y;
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
    my.replicaId = function (_) {
        return arguments.length ? ((replicaId = _), my) : replicaId;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    my.timestamp = function (_) {
        return arguments.length ? ((timestamp = _), my) : timestamp;
    };
    return my;
};
