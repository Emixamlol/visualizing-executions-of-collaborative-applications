import RevisitedCounter from '../CRDTs/PN-Counter/revisited-counter';
import VectorClock from '../CRDTs/vector-clock';

export type payload = [string, Array<number>];

export enum CRDTtype {
  flag = 'flag',
  inc_counter = 'inc_counter',
  grow_set = 'grow_set',
  counter = 'counter',
  register = 'register',
  set = 'set',
}

export type CRDTmethodType = 'query' | 'update' | 'merge' | 'specific';

export interface CRDTInterface {
  type: CRDTtype; // each CRDT knows its type

  merge(crdt: CRDTInterface): CRDTInterface;

  payload(): payload; // payload returns array with a string (actual payload) and timestamp

  getTimestamp(): Array<number>;
}

// ------------------------------------------ revisited ------------------------------------------

// Interface for a state-based CRDT
export interface StateBasedInterface<
  PayloadInterface,
  QueryInterface,
  UpdateInterface
> {
  type: CRDTtype;

  query: QueryInterface;

  update: UpdateInterface;

  // compare(other: PayloadInterface): boolean;

  // merge(other: [PayloadInterface, VectorClock]): PayloadInterface;

  compare(
    other: StateBasedInterface<
      PayloadInterface,
      QueryInterface,
      UpdateInterface
    >
  ): boolean;

  merge(
    other: StateBasedInterface<
      PayloadInterface,
      QueryInterface,
      UpdateInterface
    >
  ): PayloadInterface;

  getPayload(): [PayloadInterface, VectorClock];
}

type event<T> = {
  id: [number, number];

  operation: T;

  timestamp: Array<number>;

  causal_history: Set<event<T>>;
};
