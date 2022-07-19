import * as d3 from 'd3';
export const drawObjectEllipse = () => {
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
        const htmlClass = 'object-ellipse';
        console.log(x(1));
        selection
            .selectAll(`text.${htmlClass}`)
            .data(objects)
            .join('text')
            .attr('class', htmlClass)
            .attr('x', x(0))
            .attr('y', (d) => d.y)
            .attr('fill', 'black')
            .text((d) => d.text);
        selection
            .selectAll(`path.${htmlClass}`)
            .data(objects)
            .join('path')
            .attr('class', htmlClass)
            .attr('transform', `translate(0, 0)`)
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('stroke-dasharray', '10 10')
            .attr('d', (d) => `M ${x(1)} ${d.y} A 50 200 0 0 1 ${x(1) + 100} ${d.y} A 50 200 0 0 1 ${x(1)} ${d.y}` // `M 30 200 A 50 100 0 0 1 130 200 A 50 100 0 0 1 30 200`
        );
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
