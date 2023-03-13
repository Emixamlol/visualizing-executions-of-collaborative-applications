import * as d3 from 'd3';
import { Data, margin, ReusableSet } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs, getStateCoordinates } from '../../data-processing';

export const set = (): ReusableSet => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let elements: Array<string>;
  let tombstone: Array<string> = [];

  const my: ReusableSet = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    const colorScale = d3
      .scaleOrdinal()
      .domain(replicas)
      .range(d3.schemePaired);

    const x = margin.left * 2 + 100;

    const t = d3.transition().duration(1000);

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

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    // label
    const labelx = margin.left * 2 + 50;

    g.selectAll(`text.${replicaId}`)
      .data([null])
      .join((enter) =>
        enter
          .append('text')
          .attr('x', labelx)
          .attr('y', y)
          .text(`${replicaId} : `)
      );

    // rest

    const positionSet = (tspan) => {
      tspan
        .attr('class', replicaId)
        .attr('x', x)
        .attr('y', (d, i) => y + i * 20)
        .attr('fill', (d) => {
          if (tombstone.includes(d)) return 'red';
        })
        .text((d) => d);
    };

    const text = g
      .selectAll(`text.${replicaId}`)
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
              (enter) =>
                enter
                  .append('tspan')
                  .call(positionSet)
                  .filter((d) => tombstone.includes(d))
                  .attr('fill', 'red'),
              (update) =>
                update
                  .call(positionSet)
                  .filter((d) => tombstone.includes(d))
                  .attr('fill', 'red')
            )
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

  my.tombstone = function (_?: Array<string>): any {
    return arguments.length ? ((tombstone = _), my) : tombstone;
  };

  my.elements = function (_?: Array<string>): any {
    return arguments.length ? ((elements = _), my) : elements;
  };

  return my;
};
