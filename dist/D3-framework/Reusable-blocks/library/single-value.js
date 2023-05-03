import * as d3 from 'd3';
export const singleValue = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data;
    let color;
    let value;
    let innerG;
    const my = (selection) => {
        // set scales
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        const t = d3.transition().duration(1000);
        // visualization
        const htmlClass = 'crdt-single-value';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        const spawnValue = (text) => {
            text.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
        };
        const positionValue = (text) => {
            text
                .attr('class', [htmlClass, replicaId].join(' '))
                .attr('x', x)
                .attr('y', y)
                .attr('fill', (d) => (color === undefined ? 'black' : color))
                .call((text) => text.text(value));
        };
        innerG = g
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        innerG
            .selectAll(`text.${htmlClass}.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .call(positionValue)
            .call(spawnValue), (update) => update.attr('fill-opacity', 1).transition(t).call(positionValue));
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
    my.color = function (_) {
        return arguments.length ? ((color = _), my) : color;
    };
    my.value = function (_) {
        return arguments.length ? ((value = _), my) : value;
    };
    my.bbox = () => innerG.node().getBBox();
    return my;
};
