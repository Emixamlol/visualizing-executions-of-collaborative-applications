import * as d3 from 'd3';

interface ReusableMergeArrows {
  (selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void;
}

export const mergeArrows = (): ReusableMergeArrows => {
  const my: ReusableMergeArrows = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    const htmlClass = 'merge-arrows';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    // curved arrow from sender to receiver replica

    const curve = g
      .selectAll('path.curve')
      .data([null])
      .join('path')
      .attr('class', 'curve')
      .attr('d', 'M 0 36 Q 80 -34 174.78 32.35')
      .attr('fill', 'none')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-miterlimit', 10)
      .attr('pointer-events', 'stroke');

    const head = g
      .selectAll('path.head')
      .data([null])
      .join('path')
      .attr('class', 'head')
      .attr(
        'd',
        'M 179.08 35.36 L 171.34 34.21 L 174.78 32.35 L 175.36 28.48 Z'
      )
      .attr('fill', 'rgb(0, 0, 0)')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-miterlimit', 10)
      .attr('pointer-events', 'all');

    curve.attr('transform', 'translate(300, 120)');
    head.attr('transform', 'translate(300, 120)');

    // arrow from receiver replica to result of merge

    const receiverLine = g
      .selectAll('path.senderLine')
      .data([null])
      .join('path')
      .attr('class', 'senderLine')
      .attr('d', 'M 127 7 L 11.5 122.5')
      .attr('fill', 'none')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-miterlimit', 10)
      .attr('pointer-events', 'stroke');

    const receiverHead = g
      .selectAll('path.senderHead')
      .data([null])
      .join('path')
      .attr('class', 'senderHead')
      .attr('d', 'M 7.79 126.21 L 10.27 118.78 L 11.5 122.5 L 15.22 123.73 Z')
      .attr('fill', 'rgb(0, 0, 0)')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-miterlimit', 10)
      .attr('pointer-events', 'all');

    receiverLine.attr('transform', 'translate(500, 280)');
    receiverHead.attr('transform', 'translate(500, 280)');
  };

  return my;
};
