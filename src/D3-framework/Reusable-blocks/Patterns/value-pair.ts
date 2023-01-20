import * as d3 from 'd3';
import { margin, ReusableValuePair } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const valuePair = (): ReusableValuePair => {
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let tuples: Array<[string, ID]>;

  const my: ReusableValuePair = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const x = margin.left * 2 + 50;

    const y = margin.top * 2 + 50;

    const t = d3.transition().duration(1000);

    const cx = x + 300;

    const sqrtScale = d3.scaleSqrt().domain([0, 100]).range([0, 50]);

    // process data

    // visualization
    const htmlClass = 'crdt-value-pair';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    // visualize elements

    const positionSet = (tspan) => {
      tspan
        .attr('class', replicaId)
        .attr('x', x)
        .attr('y', (d, i) => y + i * 20)
        .text((d) => d[0]);
    };

    g.selectAll('text')
      .data([null])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', replicaId)
            .attr('x', x)
            .attr('y', y)
            .selectAll('tspan')
            .data(tuples)
            .join((enter) => enter.append('tspan').call(positionSet)),
        (update) =>
          update
            .selectAll('tspan')
            .data(tuples)
            .join(
              (enter) => enter.append('tspan').call(positionSet),
              (update) => update.call(positionSet)
            )
      );

    // visualize unique identifiers associated to the elements

    const positionCircle = (circle) => {
      circle
        .attr('r', (d) => sqrtScale(d[1]))
        .attr('cx', cx)
        .attr('cy', (d, i) => y + i * 20);
    };

    g.selectAll('circle')
      .data(tuples)
      .join(
        (enter) => enter.append('circle').call(positionCircle),
        (update) => update.call(positionCircle)
      );
  };

  my.width = function (_?: number): any {
    return arguments.length ? ((width = _), my) : width;
  };

  my.height = function (_?: number): any {
    return arguments.length ? ((height = _), my) : height;
  };

  my.margin = function (_?: margin): any {
    return arguments.length ? ((margin = _), my) : margin;
  };

  my.replicaId = function (_?: ID): any {
    return arguments.length ? ((replicaId = _), my) : replicaId;
  };

  my.tuples = function (_?: Array<[string, ID]>): any {
    return arguments.length ? ((tuples = _), my) : tuples;
  };

  return my;
};
