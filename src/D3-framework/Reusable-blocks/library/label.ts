import * as d3 from 'd3';
import { Data, margin, ReusableLabel } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs } from '../../data-processing';

export const label = (): ReusableLabel => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data;

  const my: ReusableLabel = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales

    // process data

    // visualization
    const htmlClass = 'crdt-label';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    g.selectAll(`text.${htmlClass}.${replicaId}`)
      .data([null])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', [htmlClass, replicaId].join(' '))
            .attr('x', x)
            .attr('y', y)
            // .attr('fill-opacity', 0.5)
            .text(`${replicaId} : `),
        (update) => update.attr('x', x).attr('y', y)
      );
  };

  my.label = null;

  my.x = function (_?: number): any {
    return arguments.length ? ((x = _), my) : x;
  };

  my.y = function (_?: number): any {
    return arguments.length ? ((y = _), my) : y;
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

  my.data = function (_?: Data): any {
    return arguments.length ? ((data = _), my) : data;
  };

  return my;
};
