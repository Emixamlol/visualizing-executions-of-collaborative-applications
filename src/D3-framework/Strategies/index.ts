import {
  Strategy,
  VisualizationInterface,
} from '../../types/d3-framework-types';
import { ReplicaVisualization } from './replica-visualization';
import { TimeVisualization } from './time-visualization';

export const strategies: Map<Strategy, VisualizationInterface> = new Map([
  [Strategy.time, new TimeVisualization()],
  [Strategy.replica, new ReplicaVisualization()],
]);
