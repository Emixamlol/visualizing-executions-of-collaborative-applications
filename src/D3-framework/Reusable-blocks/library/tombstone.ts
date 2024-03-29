import * as d3 from 'd3';
import { rgb } from 'd3';
import {
  Data,
  margin,
  ReusableTombstone,
} from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const tombstone = (): ReusableTombstone => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let color: string;
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

  const my: ReusableTombstone = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    const t = d3.transition().duration(1000);

    // process data

    // visualization
    const htmlClass = 'crdt-tombstone';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    const positionTombstone = (path): void => {
      path
        .attr('transform', 'rotate(-90, 20.26, 31.99)')
        .attr('stroke', rgb(0, 0, 0))
        .attr(
          'd',
          'M -12.09 11.36 L 31.99 11.36 Q 52.61 11.36 52.61 31.99 Q 52.61 52.61 31.99 52.61 L -12.09 52.61 Z'
        );
    };

    const colorTombstone = (path): void => {
      path.attr('fill', rgb(255, 255, 255));
    };

    g.selectAll(`path.${htmlClass}`)
      .data([null])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('id', 'tombstone')
            .attr('class', htmlClass)
            .call(positionTombstone)
            .call((enter) => enter.transition(t).call(colorTombstone)),
        (update) => update.call(positionTombstone).call(colorTombstone)
      );

    const positionCross = (path): void => {
      path
        .attr('stroke', rgb(0, 0, 0))
        .attr(
          'd',
          'M 11.5 17.25 L 18.5 17.25 L 18.5 9 L 22 9 L 22 17.25 L 29 17.25 L 29 20.75 L 22 20.75 L 22 29 L 18.5 29 L 18.5 20.75 L 11.5 20.75 Z'
        );
    };

    const colorCross = (path): void => {
      path.attr('fill', rgb(255, 255, 255));
    };

    innerG = g
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    innerG
      .selectAll('path#cross')
      .data([null])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('id', 'cross')
            .attr('class', replicaId)
            .call(positionCross)
            .call((enter) => enter.transition(t).call(colorCross)),
        (update) => update.call(positionCross).call(colorCross)
      );

    // <g><path d="M -12.09 11.36 L 31.99 11.36 Q 52.61 11.36 52.61 31.99 Q 52.61 52.61 31.99 52.61 L -12.09 52.61 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" transform="rotate(-90,20.26,31.99)" pointer-events="all"/>

    // <path d="M 11.5 17.25 L 18.5 17.25 L 18.5 9 L 22 9 L 22 17.25 L 29 17.25 L 29 20.75 L 22 20.75 L 22 29 L 18.5 29 L 18.5 20.75 L 11.5 20.75 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/></g>
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

  my.bbox = () => (innerG.node() as SVGGraphicsElement).getBBox();

  return my;
};
