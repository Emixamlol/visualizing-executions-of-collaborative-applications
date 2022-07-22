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

// different kinds of processed data for different visualization parts
export type subData = {
  objectIds: Array<ID>;
  replicas: Array<ReplicaInterface>;
  replicaIds: Array<ID>;
  states: Array<StateInterface>;
};

export type margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/** ---------------------------------------------------------------------------------------------------------------------
 *
 * Reusable Visualization Components
 *
 *
 * The following interfaces define the API's for reusable visualization components which can be used as building blocks in order to combine different data visualizations according to different needs
 *
 */

export interface ReusablePatternInterface<T> {
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
  extends ReusablePatternInterface<ReusableObjectEllipse> {}

export interface ReusableObjectCircle
  extends ReusablePatternInterface<ReusableObjectCircle> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;
}

export interface ReusableBasicState
  extends ReusablePatternInterface<ReusableBasicState> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;
}

export interface ReusableTimeLine
  extends ReusablePatternInterface<ReusableTimeLine> {}
