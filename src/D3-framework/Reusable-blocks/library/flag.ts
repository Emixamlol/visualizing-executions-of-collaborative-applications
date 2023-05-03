import * as d3 from 'd3';
import { Data, margin, ReusableFlag } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const flag = (): ReusableFlag => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let enabled: boolean;
  let replicaId: ID;
  let data: Data = [];
  let color: string;
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

  const my: ReusableFlag = (
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

    // process data

    // visualization
    const htmlClass = 'crdt-flag';

    const positionFlag = (path): void => {
      path
        .attr('transform', `translate(${x}, ${y})`)
        .attr('fill', 'white')
        .attr('d', d3.symbol(d3.symbolsFill[5], 150)());
    };

    const colorFlag = (path): void => {
      const color = enabled ? 'green' : 'red';
      path.attr('fill', color).attr('stroke', color);
    };

    const g = selection
      .selectAll(`g.${replicaId}`)
      .data([null])
      .join('g')
      .attr('class', replicaId);

    innerG = g
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    innerG
      .selectAll('path')
      .data([null])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', htmlClass)
            .call(positionFlag)
            .call((enter) => enter.transition(t).call(colorFlag)),
        (update) =>
          update
            .call((update) => update.transition(t).call(positionFlag))
            .call((update) => update.transition(t).call(colorFlag))
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

  my.enabled = function (_?: boolean): any {
    return arguments.length ? ((enabled = _), my) : enabled;
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
