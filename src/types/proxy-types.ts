import VectorClock from '../CRDTs/vector-clock';
import { crdt } from './crdt-types';

// State
// ------------------------------------------------------------------------------

function* ColorGenerator(): Generator<string, void, string> {
  const colors = ['DarkMagenta', 'blue', 'brown', 'DarkGoldenRod', 'green'];

  let i = 0;
  while (true) {
    yield colors[i];
    i = i < colors.length - 2 ? i + 1 : 0;
  }
}

export const colorGenerator = ColorGenerator();

// the type parameter T is the type of the payload
interface HistoryInterface<T> {
  msg: string;
  payload: [T, VectorClock];
}

// the type parameter T is the type of the payload
export interface StateInterface<T> {
  history: HistoryInterface<T>[]; // array of payload history with msg giving information on which update was executed
  payload: [T, VectorClock]; // payload of current state
  color: string; // color to be used by d3
}

// ------------------------------------------------------------------------------

// Proxy
// ------------------------------------------------------------------------------

export enum ProxyMethod {
  new = 'new',
  delete = 'delete',
  replicate = 'replicate',
  merge = 'merge',
  apply = 'apply',
}

export interface ProxyInterface<T> {
  id: string;

  query: (...args: string[]) => T;

  compare: (other: T) => boolean;

  merge: (other: T) => T;

  apply: (crdtReplica: T) => void;

  replicate: (replicaId: number) => T;
}

// ------------------------------------------------------------------------------
