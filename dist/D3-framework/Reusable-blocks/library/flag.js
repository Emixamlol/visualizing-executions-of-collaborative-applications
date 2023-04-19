import * as d3 from 'd3';
export const flag = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let enabled;
    let replicaId;
    let data = [];
    let color;
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
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        g.selectAll('path')
            .data([null])
            .join((enter) => enter
            .append('path')
            .attr('class', htmlClass)
            .call(positionFlag)
            .call((enter) => enter.transition(t).call(colorFlag)), (update) => update
            .call((update) => update.transition(t).call(positionFlag))
            .call((update) => update.transition(t).call(colorFlag)));
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
    my.enabled = function (_) {
        return arguments.length ? ((enabled = _), my) : enabled;
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
    return my;
};
