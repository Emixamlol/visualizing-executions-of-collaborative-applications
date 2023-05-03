import * as d3 from 'd3';
import {
  Data,
  margin,
  ReusableTimestamp,
} from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const timestamp = (): ReusableTimestamp => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let color: string;
  let timestamp: Array<number>;
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

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

    const t = d3.transition().duration(1000);

    // visualization
    const htmlClass = 'crdt-timestamp';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    const bandScale = d3
      .scaleBand()
      .domain(d3.range(timestamp.length).map((val) => val.toString()))
      .range([0, 300])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...timestamp), Math.max(...timestamp)])
      .range([5, 20]);

    const spawnRect = (rect) => {
      rect.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
    };

    const positionRect = (rect) => {
      rect
        .attr('x', (d, i) => x + bandScale(i.toString()))
        .attr('y', y)
        .attr('height', (d) => {
          // console.log(d);
          return yScale(d);
        });
    };

    innerG = g
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    innerG
      .selectAll('rect')
      .data(timestamp)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', htmlClass)
            .call(positionRect)
            .attr('width', bandScale.bandwidth())
            .attr(
              'fill',
              color === undefined ? (colorScale(replicaId) as string) : color
            )
            .call(spawnRect)
            .append('title')
            .text((d) => d),
        (update) =>
          update
            .attr('fill-opacity', 1)
            .transition(t)
            .call(positionRect)
            .attr('width', bandScale.bandwidth())
            .attr(
              'fill',
              color === undefined ? (colorScale(replicaId) as string) : color
            )
            .select('title')
            .text((d) => d)
      );

    console.log(
      (innerG.node() as SVGGraphicsElement).getBBox(),
      'inner g bbox'
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

  my.color = function (_?: string): any {
    return arguments.length ? ((color = _), my) : color;
  };

  my.timestamp = function (_?: Array<number>): any {
    return arguments.length ? ((timestamp = _), my) : timestamp;
  };

  my.bbox = () => (innerG.node() as SVGGraphicsElement).getBBox();

  return my;
};
