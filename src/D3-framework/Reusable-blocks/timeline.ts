import * as d3 from 'd3';
import { Data, margin, ReusableTimeLine } from '../../types/d3-framework-types';

export const drawTimeLine = (): ReusableTimeLine => {
  let width: number;
  let height: number;
  let margin: margin;
  let data: Data;

  const my: ReusableTimeLine = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set x and y scales
    const x = margin.left * 9;

    const y = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([margin.top, height - margin.bottom]);

    // process data
    const objects: Array<
      Array<{ ry: number; startY: number; y: number; text: string }>
    > = data.reduce(
      (accumulator, [id, replicas]) =>
        accumulator.concat([
          replicas.map((replica, i) => {
            const length = accumulator.length;
            const ry = replicas.length * 50;
            const startY =
              margin.top +
              (length
                ? accumulator[length - 1][0].startY +
                  2 * accumulator[length - 1][0].ry
                : 0);
            const y = startY + 25 + margin.top + 100 * i; // 25 is the radius, to be changed sensical variable name for timeline
            return {
              ry,
              startY,
              y,
              text: replica.id,
            };
          }),
        ]),
      []
    );

    // visualization
    const htmlClass = 'timeline';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    g.selectAll('g')
      .data(objects)
      .join('g')
      .selectAll('path')
      .data((d) => d)
      .join('path')
      .attr('transform', `translate(0, 0)`)
      .attr('stroke', 'blue')
      .attr('d', (d) => {
        return `M ${x} ${d.y} l ${width - x} 0`;
      });
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

  my.data = function (_?: Data): any {
    return arguments.length ? ((data = _), my) : data;
  };

  return my;
};
