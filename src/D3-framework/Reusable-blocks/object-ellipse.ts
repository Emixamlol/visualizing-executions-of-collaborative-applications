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
    // set scales
    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, margin.left * 2]);

    const t = d3.transition().duration(1000);

    // process data
    type processedData = Array<{
      id: string;
      rx: number;
      ry: number;
      y: number;
    }>;

    const objects: processedData = data.reduce(
      (accumulator: processedData, [id, replicas]) =>
        accumulator.concat({
          id,
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

    // visualization
    const htmlClass = 'object-ellipse';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    g.selectAll('text')
      .data(objects)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('x', x(0))
            .attr('y', (d) => d.y)
            .attr('fill', 'white')
            .text((d) => d.id)
            .call((enter) => enter.transition(t).attr('fill', 'black')),
        (update) =>
          update
            .transition(t)
            .attr('x', x(0))
            .attr('y', (d) => d.y)
            .attr('fill', 'black')
      );

    g.selectAll('path')
      .data(objects)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('transform', `translate(0, 0)`)
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('stroke-dasharray', '10 10')
            .attr(
              'd',
              (d) =>
                `M ${x(1)} ${d.y} A 0 0 0 0 1 ${x(1)} ${d.y} A 0 0 0 0 1 ${x(
                  1
                )} ${d.y}`
            )
            .call((enter) =>
              enter.transition(t).attr(
                'd',
                (d) => {
                  return `M ${x(1)} ${d.y} A ${d.rx} ${d.ry} 0 0 1 ${
                    x(1) + 100
                  } ${d.y} A ${d.rx} ${d.ry} 0 0 1 ${x(1)} ${d.y}`;
                } // `M 30 200 A 50 100 0 0 1 130 200 A 50 100 0 0 1 30 200`
              )
            ),
        (update) =>
          update.transition(t).attr(
            'd',
            (d) => {
              return `M ${x(1)} ${d.y} A ${d.rx} ${d.ry} 0 0 1 ${x(1) + 100} ${
                d.y
              } A ${d.rx} ${d.ry} 0 0 1 ${x(1)} ${d.y}`;
            } // `M 30 200 A 50 100 0 0 1 130 200 A 50 100 0 0 1 30 200`
          )
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
