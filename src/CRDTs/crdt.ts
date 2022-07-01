import VectorClock from './vector-clock';

export default interface CRDTInterface<C, R> {
  merge: (crdt: C) => C;

  payload: () => [R, number[]]; // payload returns array with generic R (result type) and timestamp

  getTimestamp: () => number[];
}
