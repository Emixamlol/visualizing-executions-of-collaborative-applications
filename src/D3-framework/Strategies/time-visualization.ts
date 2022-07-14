import {
  ReplicaInterface,
  VisualizationInterface,
} from '../../types/d3-framework-types';

export class TimeVisualization implements VisualizationInterface {
  visualize = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    replicas: ReplicaInterface[]
  ): void => {
    const { height, width, x, y } = svg.node().getBoundingClientRect();
    // timelines
    const timelines = svg.append('g');
    timelines
      .selectAll('path')
      .data(replicas)
      .join((enter) =>
        enter
          .append('g')
          .append('path')
          .attr('stroke', 'black')
          .attr(
            'd',
            (d, idx) =>
              `M ${x + width / 5} ${idx * (height / 10) + 50} l ${
                width - (x + width / 5)
              } 0`
          )
      );

    // basicStates
    const basicStates = svg.append('g');
    basicStates
      .selectAll('path')
      .data(replicas)
      .join((enter) =>
        enter
          .append('circle')
          .attr(
            'cx',
            ({ id, state }, idx) => x + width / 5 + idx * (x + width / 6)
          )
          .attr('cy', ({ id, state }) => {
            const replicaId = id;
            const idx = replicas.findIndex(({ id, state }) => id === replicaId);
            return idx * (height / 10) + 50;
          })
          .attr('r', 10)
      );
  };

  update = (): void => {
    throw new Error('Method not implemented.');
  };
}
