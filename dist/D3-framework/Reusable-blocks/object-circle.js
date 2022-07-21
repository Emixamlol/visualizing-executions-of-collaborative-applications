import * as d3 from 'd3';
export const drawObjectCircle = () => {
    let width;
    let height;
    let margin;
    let data;
    const my = (selection) => {
        // set x and y scales
        const x = d3
            .scaleLinear()
            .domain([0, 1])
            .range([margin.left, margin.left * 2]);
        const y = d3
            .scaleLinear()
            .domain([0, data.length])
            .range([margin.top, height - margin.bottom]);
        // process data
        const objects = data.map(([id, replicas], i) => ({
            y: (height / data.length) * (i + 1) + margin.top,
            text: id,
        }));
        // const replicas = data.ma
        console.log(objects);
        // visualization
        const htmlClass = 'object-circle';
        console.log(x(1));
        // selection
        //   .selectAll(`circle.${htmlClass}`)
        //   .data(objects)
        //   .join('circle')
        //   .attr('class', htmlClass)
        //   .attr('cx', x(0))
        //   .attr('cy', (d) => d.y)
        //   .attr('fill', 'black')
        //   .text((d) => d.text);
        selection
            .selectAll(`g.${htmlClass}`)
            .data(data)
            .join('g')
            .attr('class', htmlClass)
            .selectAll(`circle.${htmlClass}`)
            .data((d) => (console.log('reassigning data'), console.log(d[1]), d[1]))
            .join('circle')
            .attr('cx', (d, i) => (console.log(d, i), i * x(0)))
            .attr('cy', (d, i) => i * x(0))
            .attr('r', 10)
            .attr('fill', 'blue')
            .attr('stroke', 'blue');
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
    return my;
};