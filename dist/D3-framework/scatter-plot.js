import * as d3 from 'd3';
export const scatterPlot = () => {
    let width;
    let height;
    let data;
    let xValue;
    let yValue;
    let margin;
    let radius;
    const my = (selection) => {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([margin.left, width - margin.right]);
        const y = d3
            .scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([height - margin.bottom, margin.top]);
        const marks = data.map((d) => ({
            x: x(xValue(d)),
            y: y(yValue(d)),
            title: `${xValue(d)}, ${yValue(d)}`,
        }));
        console.log(marks);
        const t = d3.transition().duration(1000); //.ease(d3.easeLinear);
        // enter => enter.append("text")
        //         .attr("fill", "green")
        //         .attr("x", (d, i) => i * 16)
        //         .attr("y", -30)
        //         .text(d => d)
        //       .call(enter => enter.transition(t)
        //         .attr("y", 0)),
        //     update => update
        //         .attr("fill", "black")
        //         .attr("y", 0)
        //       .call(update => update.transition(t)
        //         .attr("x", (d, i) => i * 16)),
        //     exit => exit
        //         .attr("fill", "brown")
        //       .call(exit => exit.transition(t)
        //         .attr("y", 30)
        //         .remove())
        const positionCircles = (circles) => {
            circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        };
        const circles = selection
            .selectAll('circle')
            .data(marks)
            .join((enter) => enter
            .append('circle')
            .call(positionCircles)
            .attr('r', 0)
            .call((enter) => enter.transition(t).attr('r', radius)), (update) => update.call((update) => update
            .transition(t)
            .delay((d, i) => i * 10)
            .call(positionCircles)), (exit) => exit.remove)
            .transition(t)
            .attr('r', radius);
        // circles.append('title').text((d) => d.title);
        // .append('title')
        // .text((d: { title: string }) => d.title);
        // selection
        //   .append('g')
        //   .attr('transform', `translate(${margin.left}, 0)`)
        //   .call(d3.axisLeft(y));
        selection
            .selectAll('g.y-axis')
            .data([null])
            .join('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));
        // selection
        //   .append('g')
        //   .attr('transform', `translate(0, ${height - margin.bottom})`)
        //   .call(d3.axisBottom(x));
        selection
            .selectAll('g.x-axis')
            .data([null])
            .join('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .transition(t)
            .call(d3.axisBottom(x));
    };
    my.width = function (_) {
        return arguments.length ? ((width = +_), my) : width;
    };
    my.height = function (_) {
        return arguments.length ? ((height = +_), my) : height;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    my.xValue = function (_) {
        return arguments.length ? ((xValue = _), console.log(xValue), my) : xValue;
    };
    my.yValue = function (_) {
        return arguments.length ? ((yValue = _), my) : yValue;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };
    my.radius = function (_) {
        return arguments.length ? ((radius = +_), my) : radius;
    };
    return my;
};
