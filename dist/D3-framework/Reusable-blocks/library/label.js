import * as d3 from 'd3';
export const label = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data;
    const my = (selection) => {
        // set scales
        const t = d3.transition().duration(1000);
        // process data
        // visualization
        const htmlClass = 'crdt-label';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        const positionLabel = (text) => {
            text.attr('x', x).attr('y', y);
        };
        const spawnLabel = (text) => {
            text.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
        };
        g.selectAll(`text.${htmlClass}.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('class', [htmlClass, replicaId].join(' '))
            .call(positionLabel)
            .call(spawnLabel)
            .text(`${replicaId} : `), (update) => update.attr('fill-opacity', 1).transition(t).call(positionLabel));
    };
    my.label = null;
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
    return my;
};
