import * as d3 from 'd3';
import {
  Data,
  ReusableSingleValue,
  margin,
} from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const singleValue = (): ReusableSingleValue => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data;
  let color: string;
  let value: number;
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

  const my: ReusableSingleValue = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    const t = d3.transition().duration(1000);

    // visualization
    const htmlClass = 'crdt-single-value';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    const spawnValue = (text) => {
      text.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
    };

    const positionValue = (text) => {
      text
        .attr('class', [htmlClass, replicaId].join(' '))
        .attr('x', x)
        .attr('y', y)
        .attr('fill', (d) => (color === undefined ? 'black' : color))
        .call((text) => text.text(value));
    };

    innerG = g
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    innerG
      .selectAll(`text.${htmlClass}.${replicaId}`)
      .data([null])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .call(positionValue)
            .call(spawnValue),
        (update) =>
          update.attr('fill-opacity', 1).transition(t).call(positionValue)
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

  my.value = function (_?: number): any {
    return arguments.length ? ((value = _), my) : value;
  };

  my.bbox = () => (innerG.node() as SVGGraphicsElement).getBBox();

  return my;
};
