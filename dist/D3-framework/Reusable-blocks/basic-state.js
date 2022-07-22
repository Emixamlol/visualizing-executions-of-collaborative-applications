import * as d3 from 'd3';
export const drawBasicState = () => {
    let width;
    let height;
    let margin;
    let data;
    let radius;
    const my = (selection) => {
        // set scales
        const x = margin.left * 9;
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
                    const { color, history, merges } = state;
                    const xScale = d3
                        .scaleLinear()
                        .domain([0, history.length])
                        .range([x, x + history.length * 125]);
                    return history.map(({ msg, payload }, i) => ({
                        cx: xScale(i),
                        cy,
                        ry,
                        startY,
                        id: replicaId,
                        title: `operation = ${msg},
                 \npayload = ${payload[0]}, 
                 \ntimestamp = ${JSON.stringify(payload[1])}`,
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
        // g.selectAll('circle')
        //   .data(objects)
        //   .join(
        //     (enter) =>
        //       enter
        //         .append('circle')
        //         .attr('cx', (d) => d.cx)
        //         .attr('cy', (d) => d.cy)
        //         .attr('r', radius)
        //         .attr('fill', (d) => colorScale(d.id) as string)
        //         .attr('stroke', (d) => colorScale(d.id) as string)
        //         .append('title')
        //         .text((d) => d.title),
        //     (update) =>
        //       update
        //         .attr('cx', (d) => d.cx)
        //         .attr('cy', (d) => d.cy)
        //         .attr('r', radius)
        //         .attr('fill', (d) => colorScale(d.id) as string)
        //         .attr('stroke', (d) => colorScale(d.id) as string)
        //         .select('title')
        //         .text((d) => d.title)
        //   );
        g.selectAll('circle')
            .data(objects)
            .join((enter) => enter
            .append('circle')
            .attr('cx', (d) => d.cx)
            .attr('cy', (d) => d.cy)
            .attr('r', 0)
            .call((enter) => enter
            .transition(t)
            .attr('r', radius)
            .attr('fill', (d) => colorScale(d.id))
            .attr('stroke', (d) => colorScale(d.id)))
            .append('title')
            .text((d) => d.title), (update) => update
            .attr('cx', (d) => d.cx)
            .attr('cy', (d) => d.cy)
            .attr('r', radius)
            .attr('fill', (d) => colorScale(d.id))
            .attr('stroke', (d) => colorScale(d.id))
            .select('title')
            .text((d) => d.title));
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
