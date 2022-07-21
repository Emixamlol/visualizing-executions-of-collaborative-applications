import * as d3 from 'd3';
export const drawBasicState = () => {
    let width;
    let height;
    let margin;
    let data;
    let radius;
    const my = (selection) => {
        // set x and y scales
        const x = margin.left * 9;
        const y = d3
            .scaleLinear()
            .domain([0, data.length])
            .range([margin.top, height - margin.bottom]);
        // process data
        const objects = data
            .reduce((accumulator, [id, replicas]) => {
            return accumulator.concat([
                replicas
                    .map(({ id: replicaId, state }, i) => {
                    const length = accumulator.length;
                    const ry = replicas.length * 50;
                    const startY = margin.top +
                        (length
                            ? accumulator[length - 1][0].startY +
                                2 * accumulator[length - 1][0].ry
                            : 0);
                    const cy = startY + 25 + margin.top + 100 * i; // 25 is the radius, to be changed sensical variable name for timeline
                    const { color, history, merges, payload } = state;
                    return history.map(({ msg, payload }, i) => ({
                        cx: x + margin.left + ((width - x) / history.length) * i,
                        cy,
                        ry,
                        startY,
                        text: replicaId,
                        title: `operation = ${msg}, \npayload = ${payload[0]}, \ntimestamp = ${JSON.stringify(payload[1])}`,
                    }));
                })
                    .flat(),
            ]);
        }, [])
            .flat();
        console.log('objects in basic-state');
        console.log(objects);
        // visualization
        const htmlClass = 'basic-state';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        g.selectAll('circle')
            .data(objects)
            .join('circle')
            .attr('cx', (d) => d.cx)
            .attr('cy', (d) => d.cy)
            .attr('r', radius)
            .attr('fill', 'green')
            .attr('stroke', 'green')
            .append('title')
            .text((d) => d.title);
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
        return arguments.length ? ((data = _), my) : data;
    };
    my.radius = function (_) {
        return arguments.length ? ((radius = _), my) : radius;
    };
    return my;
};
