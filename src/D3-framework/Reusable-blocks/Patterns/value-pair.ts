import * as d3 from 'd3';
import { margin, ReusableValuePair } from '../../../types/d3-framework-types';

export const valuePair = (): ReusableValuePair => {
  let width: number;
  let height: number;
  let margin: margin;

  const my: ReusableValuePair = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {};

  my.width = function (_?: number): any {
    arguments.length ? ((width = _), my) : width;
  };

  my.height = function (_?: number): any {
    arguments.length ? ((height = _), my) : height;
  };

  my.margin = function (_?: margin): any {
    arguments.length ? ((margin = _), my) : margin;
  };

  return my;
};
