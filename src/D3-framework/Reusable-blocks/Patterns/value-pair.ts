import * as d3 from 'd3';
import { margin, ReusableValuePair } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';

export const valuePair = (): ReusableValuePair => {
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;

  const my: ReusableValuePair = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    const htmlClass = 'crdt-value-pair';
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

  return my;
};
