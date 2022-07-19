import * as d3 from 'd3';
export const visualization = () => {
    let width;
    let height;
    let data;
    let radius = 5;
    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    };
    const my = (selection) => {
        // process the data
        const processedData = [
            {
                x: 20,
                y: 20,
                radius: 5,
                title: 'title',
                color: 'blue',
                pathD: `M ${width / 5} ${height / 10 + margin.top} l ${width - margin.right} 0`,
            },
        ];
        // x scale
        const x = d3
            .scaleLinear()
            .domain([0, processedData.length])
            .range([margin.left, width - margin.right]);
        // y scale
        const y = d3
            .scaleLinear()
            .domain([0, processedData.length])
            .range([height - margin.bottom, margin.top]);
        // ----------------------------- basic-state.js -----------------------------
        const basicSates = selection
            .selectAll('circle.basic-state')
            .data([1, 2])
            .join('circle')
            .attr('class', 'basic-state')
            .attr('cx', (d, i) => (i === 0 ? 30 : 50))
            .attr('cy', (d, i) => 200)
            .attr('r', radius)
            .attr('fill', (d) => 'green');
        // basicSates.append('title').text((d) => d.title);
        // ----------------------------- timeline.js -----------------------------
        const timelines = selection
            .selectAll('path.timelines')
            .data(processedData)
            .join('path')
            .attr('stroke', (d) => d.color)
            .attr('d', (d) => d.pathD);
        // ----------------------------- timeline.js -----------------------------
        // ----------------------------- end -----------------------------
    };
    my.width = function (val) {
        return arguments.length ? ((width = val), my) : width;
    };
    my.height = function (val) {
        return arguments.length ? ((height = val), my) : height;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };
    my.data = function (val) {
        return arguments.length ? ((data = val), my) : data;
    };
    return my;
};
