import * as d3 from 'd3';
import { Data, margin, ReusableSet } from '../../../types/d3-framework-types';
import { ID } from '../../../types/proxy-types';
import { StringToColor } from '../../../Utils/stringToColor';

export const set = (): ReusableSet => {
  let x: number;
  let y: number;
  let width: number;
  let height: number;
  let margin: margin;
  let replicaId: ID;
  let data: Data = [];
  let color: string;
  let elements: Array<string>;
  let tombstone: Array<string> = [];
  let innerG: d3.Selection<
    d3.BaseType | SVGGElement,
    any,
    d3.BaseType | SVGGElement,
    any
  >;

  const my: ReusableSet = (
    selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  ) => {
    // set scales
    const replicas = data
      .map(([, replicas]) => replicas.map(({ id }) => id))
      .flat();

    const colorScale = d3
      .scaleOrdinal()
      .domain(elements)
      .range(d3.schemePaired);

    const t = d3.transition().duration(1000);

    // process data

    // visualization
    const htmlClass = 'crdt-set';

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

    /**
     * -----------------------------------------------------------
     * different visualization options
     * -----------------------------------------------------------
     */

    //! (text representation)
    /*     const spawnElement = (tspan) => {
      tspan.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
    };

    const positionSet = (tspan) => {
      tspan
        .attr('class', [htmlClass, replicaId].join(' '))
        .attr('x', x)
        .attr('y', (d, i) => y + i * 20)
        .attr('fill', (d) => {
          if (tombstone.includes(d)) return 'red';
        })
        .call((tspan) => tspan.text((d) => d));
    };

    innerG
      .selectAll(`text.${htmlClass}.${replicaId}`)
      .data([null])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', [htmlClass, replicaId].join(' '))
            .attr('x', x)
            .attr('y', y)
            .selectAll('tspan')
            .data(elements)
            .join((enter) =>
              enter.append('tspan').call(positionSet).call(spawnElement)
            ),
        (update) =>
          update
            .selectAll('tspan')
            .data(elements)
            .join(
              (enter) =>
                enter
                  .append('tspan')
                  .call(positionSet)
                  .call(spawnElement)
                  .filter((d) => tombstone.includes(d))
                  .attr('fill', 'red'),
              (update) =>
                update
                  .attr('fill-opacity', 1)
                  .transition(t)
                  .call(positionSet)
                  .filter((d) => tombstone.includes(d))
                  .attr('fill', 'red')
            )
      ); */
    // !donut chart
    const reworked: Array<{ el: string; num: 1 }> = elements.map((str) => ({
      el: str,
      num: 1,
    }));
    const pie = d3.pie<{ el: string; num: 1 }>().value((d) => d.num);
    const ready_data = pie(reworked);

    const arc = d3
      .arc<d3.PieArcDatum<{ el: string; num: 1 }>>()
      .innerRadius(0)
      .outerRadius(20);

    console.log(ready_data, 'ready data');

    const spawnElement = (enter) => {
      enter.attr('fill-opacity', 0).transition(t).attr('fill-opacity', 1);
    };

    const positionSet = (enter) => {
      enter
        .attr('transform', `translate(${x + 20}, ${y})`)
        .attr('fill', (d) => StringToColor(d.data.el))
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('opacity', 0.7);
    };

    innerG
      .selectAll('path')
      .data(ready_data)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', (d) => d.data.el)
            .attr('d', arc)
            .call(positionSet)
            .call(spawnElement),
        (update) => update.attr('d', arc).call(positionSet).call(spawnElement)
      );

    elements.forEach((str) =>
      console.log(StringToColor(str), 'string to color')
    );

    // treemap

    // circular packing
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

  my.tombstone = function (_?: Array<string>): any {
    return arguments.length ? ((tombstone = _), my) : tombstone;
  };

  my.elements = function (_?: Array<string>): any {
    return arguments.length ? ((elements = _), my) : elements;
  };

  my.bbox = () => (innerG.node() as SVGGraphicsElement).getBBox();

  return my;
};
