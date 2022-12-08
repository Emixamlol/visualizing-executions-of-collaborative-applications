import * as d3 from 'd3';
export const flag = () => {
    let width;
    let height;
    let margin;
    let enabled;
    let replicaId;
    const my = (selection) => {
        // set scales
        const x = margin.left * 2 + 50;
        const y = margin.top * 2 + 50;
        const t = d3.transition().duration(1000);
        // process data
        const replicaCoordinates = [];
        console.log(`replicaCoordinates = ${replicaCoordinates}`);
        // visualization
        const htmlClass = 'crdt-flag';
        const positionFlag = (path) => {
            path
                .attr('transform', `translate(${x}, ${y})`)
                .attr('fill', 'white')
                .attr('d', d3.symbol(d3.symbolsFill[5], 150)());
        };
        const colorFlag = (path) => {
            const color = enabled ? 'green' : 'red';
            path.attr('fill', color).attr('stroke', color);
        };
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        g.selectAll('path')
            .data([null])
            .join((enter) => enter
            .append('path')
            .attr('class', replicaId)
            .call(positionFlag)
            .call((enter) => enter.transition(t).call(colorFlag)), (update) => update.call(positionFlag).call(colorFlag));
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
    my.enabled = function (_) {
        return arguments.length ? ((enabled = _), my) : enabled;
    };
    return my;
};
