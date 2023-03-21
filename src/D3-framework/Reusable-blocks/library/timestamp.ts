import * as d3 from 'd3';
import {
  Data,
  margin,
  ReusableTimestamp,
} from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs } from '../../data-processing';

export const timestamp = (): ReusableTimestamp => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let timestamp: Array<number>;

  const my: ReusableTimestamp = (
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

    // visualization
    const htmlClass = 'crdt-timestamp';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', [htmlClass, replicaId].join(' '));

    const bandScale = d3
      .scaleBand()
      .domain(d3.range(timestamp.length).map((val) => val.toString()))
      .range([50, 300])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...timestamp), Math.max(...timestamp)])
      .range([5, 20]);

    g.selectAll('rect')
      .data(timestamp)
      .join('rect')
      .attr('class', htmlClass)
      .attr('x', (d, i) => x + bandScale(i.toString()))
      .attr('y', y)
      .attr('height', (d) => {
        console.log(d);
        return yScale(d);
      })
      .attr('width', bandScale.bandwidth())
      .attr('fill', colorScale(replicaId) as string);
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

  my.timestamp = function (_?: Array<number>): any {
    return arguments.length ? ((timestamp = _), my) : timestamp;
  };

  return my;
};
