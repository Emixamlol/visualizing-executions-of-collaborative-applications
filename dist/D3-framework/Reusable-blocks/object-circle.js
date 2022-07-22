import * as d3 from 'd3';
export const drawObjectCircle = () => {
    let width;
    let height;
    let margin;
    let data;
    let radius;
    const my = (selection) => {
        // set scales
        const x = margin.left * 2 + 50;
        const y = d3
            .scaleLinear()
            .domain([0, data.length])
            .range([margin.top, height - margin.bottom]);
        const replicas = data
            .map(([id, replicas]) => replicas.map((replica) => replica.id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const t = d3.transition().duration(1000);
        // process data
        const objects = data.reduce((accumulator, [id, replicas]) => accumulator.concat([
            replicas.map((replica, i) => {
                const length = accumulator.length;
                const ry = replicas.length * 50;
                const startY = margin.top +
                    (length
                        ? accumulator[length - 1][0].startY +
                            2 * accumulator[length - 1][0].ry
                        : 0);
                const y = startY + radius + margin.top + 100 * i;
                return {
                    ry,
                    startY,
                    y,
                    id: replica.id,
                };
            }),
        ]), []);
        console.log('objects in object-circle');
        console.log(objects);
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
            .attr('cx', x)
            .attr('cy', (d) => d.y)
            .attr('fill', 'none')
            .attr('stroke', (d) => colorScale(d.id))
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
    return my;
};
