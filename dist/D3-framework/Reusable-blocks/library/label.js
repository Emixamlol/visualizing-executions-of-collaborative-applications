import * as d3 from 'd3';
export const label = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data;
    let color;
    let caption;
    let innerG;
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
            .attr('class', [htmlClass, replicaId].join(' '))
            .call(positionLabel)
            .call(spawnLabel)
            .text(`${caption} : `), (update) => update.attr('fill-opacity', 1).transition(t).call(positionLabel));
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
    my.caption = function (_) {
        return arguments.length ? ((caption = _), my) : caption;
    };
    my.bbox = () => innerG.node().getBBox();
    return my;
};
