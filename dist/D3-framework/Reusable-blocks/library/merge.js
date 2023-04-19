import * as d3 from 'd3';
export const mergeArrows = () => {
    const my = (selection) => {
        const t = d3.transition().duration(2500);
        const htmlClass = 'merge-arrows';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        // help method to spawn information
        const spawnInformation = (path) => {
            path
                .call((path) => path.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1))
                .call((path) => path.attr('stroke-opacity', 0).transition(t).attr('stroke-opacity', 1));
        };
        // curved arrow from sender to receiver replica
        const curve = g
            .selectAll('path.curve')
            .data([null])
            .join('path')
            .attr('class', 'curve')
            .attr('transform', 'translate(300, 120)')
            .attr('d', 'M 0 36 Q 80 -34 174.78 32.35')
            .attr('fill', 'none')
            .attr('stroke', 'rgb(0,0,0)')
            .attr('stroke-miterlimit', 10)
            .attr('pointer-events', 'stroke')
            .attr('stroke-dasharray', '5')
            .call(spawnInformation);
        const head = g
            .selectAll('path.head')
            .data([null])
            .join('path')
            .attr('class', 'head')
            .attr('transform', 'translate(300, 120)')
            .attr('d', 'M 179.08 35.36 L 171.34 34.21 L 174.78 32.35 L 175.36 28.48 Z')
            .attr('fill', 'rgb(0, 0, 0)')
            .attr('stroke', 'rgb(0,0,0)')
            .attr('stroke-miterlimit', 10)
            .attr('pointer-events', 'all')
            .call(spawnInformation);
        // arrow from receiver replica to result of merge
        const receiverLine = g
            .selectAll('path.senderLine')
            .data([null])
            .join('path')
            .attr('class', 'senderLine')
            .attr('transform', 'translate(500, 280)')
            .attr('d', 'M 127 7 L 11.5 122.5')
            .attr('fill', 'none')
            .attr('stroke', 'rgb(0,0,0)')
            .attr('stroke-miterlimit', 10)
            .attr('pointer-events', 'stroke')
            .call(spawnInformation);
        const receiverHead = g
            .selectAll('path.senderHead')
            .data([null])
            .join('path')
            .attr('class', 'senderHead')
            .attr('transform', 'translate(500, 280)')
            .attr('d', 'M 7.79 126.21 L 10.27 118.78 L 11.5 122.5 L 15.22 123.73 Z')
            .attr('fill', 'rgb(0, 0, 0)')
            .attr('stroke', 'rgb(0,0,0)')
            .attr('stroke-miterlimit', 10)
            .attr('pointer-events', 'all')
            .call(spawnInformation);
        // message
        g.selectAll('text')
            .data([null])
            .join('text')
            .attr('x', 370)
            .attr('y', 100)
            .text('merge')
            .call(spawnInformation);
    };
    return my;
};
