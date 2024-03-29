import * as d3 from 'd3';
import { Data, margin, ReusableLabel } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const label = (): ReusableLabel => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data;
  let color: string;
  let caption: string;
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

  const my: ReusableLabel = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales

    const t = d3.transition().duration(1000);

    // process data

    // visualization
    const htmlClass = 'crdt-label';

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    const positionLabel = (text) => {
      text.attr('x', x).attr('y', y);
    };

    const spawnLabel = (text) => {
      text.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
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
            .attr('class', [htmlClass, replicaId].join(' '))
            .call(positionLabel)
            .call(spawnLabel)
            .text(`${caption} : `),
        (update) =>
          update.attr('fill-opacity', 1).transition(t).call(positionLabel)
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

  my.caption = function (_?: string): any {
    return arguments.length ? ((caption = _), my) : caption;
  };

  my.bbox = () => (innerG.node() as SVGGraphicsElement).getBBox();

  return my;
};
