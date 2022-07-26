import { ID, StateInterface } from './proxy-types';

// visualization strategy
export enum Strategy {
  time = 'time',
  replica = 'replica',
}

export interface VisualizationInterface {
  visualize(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    replicas: Array<ReplicaInterface>
  ): void;

  update(): void;
}

export interface ReplicaInterface {
  id: ID;
  state: StateInterface;
}

export type Data = Array<[ID, Array<ReplicaInterface>]>; // type of the entire data to be sent to the d3 framework

export type margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type stateCoordinates = Array<{
  replicaId: ID;
  coordinates: Array<{ cx: number; cy: number; title: string }>;
}>;

export type lineCoordinates = Array<{
  x_1: number;
  y_1: number;
  x_2: number;
  y_2: number;
  replicaId: string;
  title: string;
}>;

export type symbolCoordinates = Array<{
  x: number;
  y: number;
  replicaId: string;
  title: string;
}>;

export type circleCoordinates = Array<{
  cx: number;
  cy: number;
  replicaId: string;
  title: string;
}>;

export type timelineCoordinates = Array<{
  id: ID;
  y: number;
  lineLength: number;
}>;

/** ---------------------------------------------------------------------------------------------------------------------
 *
 * Reusable Visualization Components
 *
 *
 * The following interfaces define the API's for reusable visualization components which can be used as building blocks in order to combine different data visualizations according to different needs
 *
 */

interface FrameworkReusableInterface<T> {
  (selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void;

  width(): number;
  width(value: number): T;

  height(): number;
  height(value: number): T;

  margin(): margin;
  margin(value: margin): T;

  data(): Data;
  data(value: Data): T;
}

export interface ReusableObjectEllipse
  extends FrameworkReusableInterface<ReusableObjectEllipse> {}

export interface ReusableObjectCircle
  extends FrameworkReusableInterface<ReusableObjectCircle> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;
}

export interface ReusableBasicState
  extends FrameworkReusableInterface<ReusableBasicState> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;
}

export interface ReusableTimeLine
  extends FrameworkReusableInterface<ReusableTimeLine> {}
