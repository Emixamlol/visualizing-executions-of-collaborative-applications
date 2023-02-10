import * as d3 from 'd3';
import { getStartYs } from '../../data-processing';
export const set = () => {
    let width;
    let height;
    let margin;
    let replicaId;
    let data = [];
    let tombstone;
    let elements;
    const my = (selection) => {
        // set scales
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        const x = margin.left * 2 + 50;
        const t = d3.transition().duration(1000);
        // process data
        const startYs = getStartYs(data, margin);
        const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
        const objects = data
            .map(([, replicas], dataIndex) => replicas.map(({ id, state }, replicaIndex) => ({
            ry: replicas.length * 50,
            y: startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex,
            id,
        })))
            .flat();
        const y = objects.at(index).y;
        // visualization
        const htmlClass = 'crdt-set';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        const positionSet = (tspan) => {
            tspan
                .attr('class', replicaId)
                .attr('x', x)
                .attr('y', (d, i) => y + i * 20)
                .text((d) => d);
        };
        g.selectAll('text')
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('class', replicaId)
            .attr('x', x)
            .attr('y', y)
            .selectAll('tspan')
            .data(elements)
            .join((enter) => enter.append('tspan').call(positionSet)), (update) => update
            .selectAll('tspan')
            .data(elements)
            .join((enter) => enter.append('tspan').call(positionSet), (update) => update.call(positionSet)));
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
    my.tombstone = function (_) {
        return arguments.length ? ((tombstone = _), my) : tombstone;
    };
    my.elements = function (_) {
        return arguments.length ? ((elements = _), my) : elements;
    };
    return my;
};
