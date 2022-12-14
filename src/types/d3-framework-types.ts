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

// ------------------------------------------- processed data types -------------------------------------------

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

interface ReusablePatternInterface<T> {
  (selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void;

  width(): number;
  width(value: number): T;

  height(): number;
  height(value: number): T;

  margin(): margin;
  margin(value: margin): T;
}

interface FrameworkReusableInterface<T> extends ReusablePatternInterface<T> {
  data(): Data;
  data(value: Data): T;
}

export interface ReusableObjectEllipse
  extends FrameworkReusableInterface<ReusableObjectEllipse> {}

export interface ReusableObjectCircle
  extends FrameworkReusableInterface<ReusableObjectCircle> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;

  on(...args): ReusableObjectCircle;
  on(...args): any;
}

export interface ReusableBasicState
  extends FrameworkReusableInterface<ReusableBasicState> {
  radius(): number;
  radius(value: number): ReusableObjectCircle;
}

export interface ReusableTimeLine
  extends FrameworkReusableInterface<ReusableTimeLine> {}

interface LibraryReusableInterface<T> extends ReusablePatternInterface<T> {
  replicaId(): ID;
  replicaId(value: ID): T;
}

export interface ReusableFlag extends LibraryReusableInterface<ReusableFlag> {
  enabled(): boolean;
  enabled(value: boolean): ReusableFlag;
}

export interface ReusableSet extends LibraryReusableInterface<ReusableSet> {
  tombstone(): boolean;
  tombstone(value: boolean): ReusableSet;

  elements(): Array<string>;
  elements(value: Array<string>): ReusableSet;
}

export interface ReusableValuePair
  extends LibraryReusableInterface<ReusableValuePair> {}

export interface ReusableTombstone
  extends LibraryReusableInterface<ReusableTombstone> {}
