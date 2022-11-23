import * as d3 from 'd3';
import { margin, ReusableTombstone } from '../../../types/d3-framework-types';

export const tombstone = (): ReusableTombstone => {
  let width: number;
  let height: number;
  let margin: margin;

  const my: ReusableTombstone = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    const htmlClass = 'crdt-tombstone';
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

  return my;
};
