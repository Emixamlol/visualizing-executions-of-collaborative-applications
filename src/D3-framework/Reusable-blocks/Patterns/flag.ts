import * as d3 from 'd3';
import { Data, margin, ReusableFlag } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { getStartYs } from '../../data-processing';

export const flag = (): ReusableFlag => {
  let width: number;
  let height: number;
  let margin: margin;
  let enabled: boolean;
  let replicaId: ID;

  const my: ReusableFlag = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const x = margin.left * 2 + 50;

    const y = margin.top * 2 + 50;

    const t = d3.transition().duration(1000);

    // process data

    const replicaCoordinates = [];

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
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    g.selectAll('path')
      .data([null])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', replicaId)
            .call(positionFlag)
            .call((enter) => enter.transition(t).call(colorFlag)),
        (update) => update.call(positionFlag).call(colorFlag)
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

  my.enabled = function (_?: boolean): any {
    return arguments.length ? ((enabled = _), my) : enabled;
  };

  return my;
};
