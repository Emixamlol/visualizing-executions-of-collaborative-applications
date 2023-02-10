import * as d3 from 'd3';
import { Data, margin, ReusableSet } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs, getStateCoordinates } from '../../data-processing';

export const set = (): ReusableSet => {
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let tombstone: boolean;
  let elements: Array<string>;

  const my: ReusableSet = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    const x = margin.left * 2 + 50;

    const t = d3.transition().duration(1000);

    // process data
    const startYs = getStartYs(data, margin);

    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;

    type processedData = Array<{ ry: number; y: number; id: string }>;

    const objects: processedData = data
      .map(([, replicas], dataIndex) =>
        replicas.map(({ id, state }, replicaIndex) => ({
          ry: replicas.length * 50,
          y: startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex,
          id,
        }))
      )
      .flat();

    const y = objects.at(index).y;

    // visualization
    const htmlClass = 'crdt-set';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    const positionSet = (tspan) => {
      tspan
        .attr('class', replicaId)
        .attr('x', x)
        .attr('y', (d, i) => y + i * 20)
        .text((d) => d);
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
            .data(elements)
            .join((enter) => enter.append('tspan').call(positionSet)),
        (update) =>
          update
            .selectAll('tspan')
            .data(elements)
            .join(
              (enter) => enter.append('tspan').call(positionSet),
              (update) => update.call(positionSet)
            )
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

  my.data = function (_?: Data): any {
    return arguments.length ? ((data = _), my) : data;
  };

  my.tombstone = function (_?: boolean): any {
    return arguments.length ? ((tombstone = _), my) : tombstone;
  };

  my.elements = function (_?: Array<string>): any {
    return arguments.length ? ((elements = _), my) : elements;
  };

  return my;
};
