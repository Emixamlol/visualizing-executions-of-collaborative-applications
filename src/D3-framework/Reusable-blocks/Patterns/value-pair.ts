import * as d3 from 'd3';
import {
  Data,
  margin,
  ReusableValuePair,
} from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs } from '../../data-processing';

export const valuePair = (): ReusableValuePair => {
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let tuples: Array<[string, ID]>;

  const my: ReusableValuePair = (
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

    const cx = x + 300;

    const sqrtScale = d3.scaleSqrt().domain([0, 100]).range([0, 50]);

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
    const htmlClass = 'crdt-value-pair';

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

    /*   const positionCircle = (circle) => {
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
      ); */

    const [value, timestamp] = [
      tuples[0][0],
      tuples[0][1].split(',').map((n) => parseInt(n)),
    ];

    const bandScale = d3
      .scaleBand()
      .domain(d3.range(timestamp.length).map((val) => val.toString()))
      .range([100, 300])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...timestamp), Math.max(...timestamp)])
      .range([5, 20]);

    g.selectAll('rect')
      .data(timestamp)
      .join('rect')
      .attr('x', (d, i) => x + bandScale(i.toString()))
      .attr('y', y)
      .attr('height', (d) => {
        console.log(d);
        return yScale(d);
      })
      .attr('width', bandScale.bandwidth())
      .attr('fill', colorScale(replicaId) as string);
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

  my.tuples = function (_?: Array<[string, ID]>): any {
    return arguments.length ? ((tuples = _), my) : tuples;
  };

  return my;
};
