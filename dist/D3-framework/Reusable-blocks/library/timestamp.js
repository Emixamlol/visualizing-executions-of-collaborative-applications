import * as d3 from 'd3';
export const timestamp = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data = [];
    let color;
    let timestamp;
    let innerG;
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
        // visualization
        const htmlClass = 'crdt-timestamp';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        const bandScale = d3
            .scaleBand()
            .domain(d3.range(timestamp.length).map((val) => val.toString()))
            .range([0, 300])
            .paddingInner(0.05);
        const yScale = d3
            .scaleLinear()
            .domain([Math.min(...timestamp), Math.max(...timestamp)])
            .range([5, 20]);
        const spawnRect = (rect) => {
            rect.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
        };
        const positionRect = (rect) => {
            rect
                .attr('x', (d, i) => x + bandScale(i.toString()))
                .attr('y', y)
                .attr('height', (d) => {
                // console.log(d);
                return yScale(d);
            });
        };
        innerG = g
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        innerG
            .selectAll('rect')
            .data(timestamp)
            .join((enter) => enter
            .append('rect')
            .attr('class', htmlClass)
            .call(positionRect)
            .attr('width', bandScale.bandwidth())
            .attr('fill', color === undefined ? colorScale(replicaId) : color)
            .call(spawnRect)
            .append('title')
            .text((d) => d), (update) => update
            .attr('fill-opacity', 1)
            .transition(t)
            .call(positionRect)
            .attr('width', bandScale.bandwidth())
            .attr('fill', color === undefined ? colorScale(replicaId) : color)
            .select('title')
            .text((d) => d));
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
    my.timestamp = function (_) {
        return arguments.length ? ((timestamp = _), my) : timestamp;
    };
    my.bbox = () => innerG.node().getBBox();
    return my;
};
