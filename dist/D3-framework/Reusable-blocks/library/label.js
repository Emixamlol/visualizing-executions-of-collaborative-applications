import { getStartYs } from '../../data-processing';
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
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        // process data
        const startYs = getStartYs(data, margin);
        const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
        const startHeights = data
            .map(([, replicas], dataIndex) => replicas.map((d, replicaIndex) => startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex))
            .flat();
        const y = startHeights.at(index);
        // visualization
        const htmlClass = 'crdt-set';
        // label
        const labelx = margin.left * 2 + 50;
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        g.selectAll(`text.${replicaId}`)
            .data([null])
            .join((enter) => enter
            .append('text')
            .attr('x', labelx)
            .attr('y', y)
            .text(`${replicaId} : `));
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
