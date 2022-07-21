import * as d3 from 'd3';
import {
  Data,
  margin,
  ReusableObjectEllipse,
} from '../../types/d3-framework-types';

export const drawObjectEllipse = (): ReusableObjectEllipse => {
  let width: number;
  let height: number;
  let margin: margin;
  let data: Data;

  const my: ReusableObjectEllipse = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set x and y scales
    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, margin.left * 2]);

    const y = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([margin.top, height - margin.bottom]);

    // process data
    const objects = data.reduce(
      (accumulator, [id, replicas]) =>
        accumulator.concat({
          text: id,
          rx: 50,
          ry: replicas.length * 50,
          y:
            margin.top +
            replicas.length * 50 +
            (accumulator.length
              ? accumulator[accumulator.length - 1].ry +
                accumulator[accumulator.length - 1].y
              : 0),
        }),
      []
    );

    console.log(objects);

    const replicas = data.map(([id, replicas]) => replicas).flat();

    console.log(replicas);

    // visualization
    const htmlClass = 'object-ellipse';

    console.log(x(1));

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    g.selectAll('text')
      .data(objects)
      .join('text')
      .attr('x', x(0))
      .attr('y', (d) => d.y)
      .attr('fill', 'black')
      .text((d) => d.text);

    g.selectAll('path')
      .data(objects)
      .join('path')
      .attr('transform', `translate(0, 0)`)
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-dasharray', '10 10')
      .attr(
        'd',
        (d) => {
          return `M ${x(1)} ${d.y} A ${d.rx} ${d.ry} 0 0 1 ${x(1) + 100} ${
            d.y
          } A ${d.rx} ${d.ry} 0 0 1 ${x(1)} ${d.y}`;
        } // `M 30 200 A 50 100 0 0 1 130 200 A 50 100 0 0 1 30 200`
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

  my.data = function (_?: Data): any {
    return arguments.length ? ((data = _), my) : height;
  };

  return my;
};
