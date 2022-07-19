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
export type ProcessedData = {
  objects: Array<ID>;
  replicas: Array<ReplicaInterface>;
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

export interface ReusablePatternInterface {
  (selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void;

  width(): number;
  width(value: number): ReusablePatternInterface;

  height(): number;
  height(value: number): ReusablePatternInterface;

  margin(): margin;
  margin(value: margin): ReusablePatternInterface;

  data(): Data;
  data(value: Data): ReusablePatternInterface;
}

export interface ReusableObjectEllipse extends ReusablePatternInterface {}

export interface ReusableObjectCircle extends ReusablePatternInterface {}
