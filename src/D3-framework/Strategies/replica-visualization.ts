import {
  ReplicaInterface,
  VisualizationInterface,
} from '../../types/d3-framework-types';

export class ReplicaVisualization implements VisualizationInterface {
  visualize = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    replicas: ReplicaInterface[]
  ): void => {
    throw new Error('Method not implemented.');
  };
  update = (): void => {
    throw new Error('Method not implemented.');
  };
}
