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
        // process data
        // visualization
        const htmlClass = 'crdt-label';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', [htmlClass, replicaId].join(' '));
        g.selectAll(`text.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('class', [htmlClass, replicaId].join(' '))
            .attr('x', x)
            .attr('y', y)
            // .attr('fill-opacity', 0.5)
            .text(`${replicaId} : `), (update) => update.attr('x', x).attr('y', y));
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
    return my;
};
