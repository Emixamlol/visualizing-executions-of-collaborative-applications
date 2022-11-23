import * as d3 from 'd3';
import { getStartYs } from '../data-processing';
export const drawObjectCircle = () => {
    let width;
    let height;
    let margin;
    let data;
    let radius;
    const listeners = d3.dispatch('mouseenter', 'mouseout');
    const my = (selection) => {
        // set scales
        const x = margin.left * 2 + 50;
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
        const objects = data.map(([, replicas], dataIndex) => replicas.map(({ id, state }, replicaIndex) => ({
            ry: replicas.length * 50,
            y: startYs[dataIndex] + radius + margin.top + 100 * replicaIndex,
            id,
        })));
        // visualization
        const htmlClass = 'object-circle';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        g.selectAll('g')
            .data(objects)
            .join('g')
            .selectAll('circle')
            .data((d) => d)
            .join((enter) => enter
            .append('circle')
            .attr('id', (d) => `${htmlClass + d.id}`)
            .attr('cx', x)
            .attr('cy', (d) => d.y)
            .attr('fill', 'none')
            .attr('stroke', (d) => colorScale(d.id))
            .on('mouseenter', (event, { id }) => {
            const circle = enter.select(`#${htmlClass + id}`);
            circle.attr('visibility', 'hidden');
            listeners.call('mouseenter', null, id);
        })
            .on('mouseout', (event, { id }) => {
            const circle = enter.select(`#${htmlClass + id}`);
            setTimeout(() => {
                circle.attr('visibility', 'visible');
                listeners.call('mouseout', null, id);
            }, 3000);
        })
            .call((enter) => enter.transition(t).attr('r', radius)), (update) => update
            .transition(t)
            .attr('cx', x)
            .attr('cy', (d) => d.y)
            .attr('r', radius)
            .attr('stroke', (d) => colorScale(d.id)));
        g.selectAll('g')
            .data(objects)
            .join('g')
            .selectAll('text')
            .data((d) => d)
            .join((enter) => enter
            .append('text')
            .attr('x', x)
            .attr('y', (d) => d.y)
            .attr('fill', 'white')
            .text((d) => d.id)
            .call((enter) => enter
            .transition(t)
            .attr('fill', (d) => colorScale(d.id))), (update) => update
            .transition(t)
            .attr('x', x)
            .attr('y', (d) => d.y)
            .text((d) => d.id)
            .attr('fill', (d) => colorScale(d.id)));
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
        return arguments.length ? ((data = _), my) : height;
    };
    my.radius = function (_) {
        return arguments.length ? ((radius = _), my) : radius;
    };
    my.on = function () {
        const value = listeners.on.apply(listeners, arguments);
        return value === listeners ? my : value;
    };
    return my;
};
