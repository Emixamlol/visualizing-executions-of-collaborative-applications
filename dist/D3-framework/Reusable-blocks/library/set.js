import * as d3 from 'd3';
export const set = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data = [];
    let elements;
    let tombstone = [];
    const my = (selection) => {
        // set scales
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const t = d3.transition().duration(1000);
        // process data
        // visualization
        const htmlClass = 'crdt-set';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        const spawnElement = (tspan) => {
            tspan.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
        };
        const positionSet = (tspan) => {
            tspan
                .attr('class', [htmlClass, replicaId].join(' '))
                .attr('x', x)
                .attr('y', (d, i) => y + i * 20)
                .attr('fill', (d) => {
                if (tombstone.includes(d))
                    return 'red';
            })
                .call((tspan) => tspan.text((d) => d));
        };
        g.selectAll(`text.${htmlClass}.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('class', [htmlClass, replicaId].join(' '))
            .attr('x', x)
            .attr('y', y)
            .selectAll('tspan')
            .data(elements)
            .join((enter) => enter.append('tspan').call(positionSet).call(spawnElement)), (update) => update
            .selectAll('tspan')
            .data(elements)
            .join((enter) => enter
            .append('tspan')
            .call(positionSet)
            .call(spawnElement)
            .filter((d) => tombstone.includes(d))
            .attr('fill', 'red'), (update) => update
            .attr('fill-opacity', 1)
            .transition(t)
            .call(positionSet)
            .filter((d) => tombstone.includes(d))
            .attr('fill', 'red')));
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
    my.tombstone = function (_) {
        return arguments.length ? ((tombstone = _), my) : tombstone;
    };
    my.elements = function (_) {
        return arguments.length ? ((elements = _), my) : elements;
    };
    return my;
};
