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
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    // process data
    const startYs = getStartYs(data, margin);

    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;

    type Heights = Array<number>;

    const startHeights: Heights = data
      .map(([, replicas], dataIndex) =>
        replicas.map(
          (d, replicaIndex) =>
            startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex
        )
      )
      .flat();

    const y = startHeights.at(index);

    // visualization
    const htmlClass = 'crdt-set';
    // label
    const labelx = margin.left * 2 + 50;

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    g.selectAll(`text.${replicaId}`)
      .data([null])
      .join((enter) =>
        enter
          .append('text')
          .attr('x', labelx)
          .attr('y', y)
          .text(`${replicaId} : `)
      );
  };

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
