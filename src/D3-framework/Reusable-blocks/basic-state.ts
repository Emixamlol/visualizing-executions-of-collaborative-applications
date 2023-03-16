import * as d3 from 'd3';
import {
  Data,
  margin,
  ReusableBasicState,
  symbolCoordinates,
} from '../../types/d3-framework-types';
import {
  getCircleCoordinates,
  getLineCoordinates,
  getStartYs,
  getSymbolCoordinates,
} from '../data-processing';

export const drawBasicState = (): ReusableBasicState => {
  let width: number;
  let height: number;
  let margin: margin;
  let data: Data = [];
  let radius: number;

  const my: ReusableBasicState = (
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
    const startYs = getStartYs(data, margin);

    const circleCoordinates = getCircleCoordinates(data, startYs, margin);

    const symbolCoordinates = getSymbolCoordinates(data, startYs, margin);

    const lineCoordinates = getLineCoordinates(data, startYs, margin);

    // visualization
    const htmlClass = 'basic-state';

    const g = selection
      .selectAll(`g.${htmlClass}`)
      .data([null])
      .join('g')
      .attr('class', htmlClass);

    // --------------------------------- circles ---------------------------------

    const positionCircles = (circles) => {
      circles.attr('cx', (d) => d.cx).attr('cy', (d) => d.cy);
    };

    const colorCircles = (circles) => {
      circles
        .attr('r', radius)
        .attr('fill', (d) => colorScale(d.replicaId))
        .attr('stroke', (d) => colorScale(d.replicaId));
    };

    g.selectAll('circle')
      .data(circleCoordinates)
      .join(
        (enter) =>
          enter
            .append('circle')
            .call(positionCircles)
            .attr('r', 0)
            .call((enter) => enter.transition(t).call(colorCircles))
            .append('title')
            .text((d) => d.title),
        // .on('click', (event, { replicaId, title }) => {
        //   console.log(`entered in circle ${replicaId} with title ${title}`);
        // })
        (update) =>
          update
            .call(positionCircles)
            .call(colorCircles)
            .select('title')
            .text((d) => d.title)
      );

    // --------------------------------- symbols ---------------------------------

    const positionSymbols = (path): void => {
      path
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
        .attr('fill', 'white')
        .attr('d', d3.symbol(d3.symbolsFill[4], 150)());
    };

    const colorSymbols = (path): void => {
      path
        .attr('fill', (d) => colorScale(d.replicaId) as string)
        .attr('stroke', (d) => colorScale(d.replicaId) as string);
    };

    g.selectAll('path.symbol')
      .data(symbolCoordinates)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', 'symbol')
            .call(positionSymbols)
            .call((enter) => enter.transition(t).call(colorSymbols))
            .append('title')
            .text((d) => d.title),
        (update) =>
          update
            .call(positionSymbols)
            .call(colorSymbols)
            .select('title')
            .text((d) => d.title)
      );

    // --------------------------------- lines ---------------------------------

    const defs = g
      .selectAll('defs')
      .data([null])
      .join((enter) => enter.append('defs'));

    const marker = defs
      .selectAll('marker')
      .data([null])
      .join((enter) => enter.append('marker'));

    marker
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse');

    const arrowPath = marker
      .selectAll('path.arrow')
      .data([null])
      .join((enter) => enter.append('path'));

    arrowPath
      .attr('class', 'arrow')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', null)
      .attr('stroke', null)
      .attr('transform', null);

    const positionLines = (line, x_2: string, y_2: string) => {
      line
        .attr('x1', (d) => d.x_1)
        .attr('y1', (d) => d.y_1)
        .attr('x2', (d) => d[x_2])
        .attr('y2', (d) => d[y_2])
        .attr('marker-end', 'url(#arrow)');
    };

    g.selectAll('line')
      .data(lineCoordinates)
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('stroke', 'black')
            .call(positionLines, 'x_1', 'y_1')
            .transition(t)
            .call(positionLines, 'x_2', 'y_2'),
        (update) => update.call(positionLines, 'x_2', 'y_2')
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
    return arguments.length ? ((data = _), my) : data;
  };

  my.radius = function (_?: number): any {
    return arguments.length ? ((radius = _), my) : radius;
  };

  return my;
};
