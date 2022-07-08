import VectorClock from '../CRDTs/vector-clock';
import CrdtProxy from '../Proxy/crdt-proxy';
import { crdt, payload } from './crdt-types';

// State
// ------------------------------------------------------------------------------

function* ColorGenerator(): Generator<string, string, string> {
  const colors = ['DarkMagenta', 'blue', 'brown', 'DarkGoldenRod', 'green'];

  let i = 0;
  while (true) {
    yield colors[i];
    i = i < colors.length - 2 ? i + 1 : 0;
  }
}

export const colorGenerator = ColorGenerator();

export enum Msg {
  initialized = 'initialized',
  update = 'update',
  merge = 'merge',
}

// the type parameter T is the type of the payload
interface HistoryInterface {
  msg: Msg;
  payload: payload;
}

// the type parameter T is the type of the payload
export interface StateInterface {
  history: HistoryInterface[]; // array of payload history with msg giving information on which update was executed
  payload: payload; // payload of current state
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

  query: (...args: string[]) => T; // T is the return type of a crdt query

  compare: (other: CrdtProxy<T>) => boolean;

  merge: (other: CrdtProxy<T>) => crdt;

  apply: (crdtReplica: CrdtProxy<T>) => void;

  replicate: (replicaId: number) => CrdtProxy<T>;
}

// ------------------------------------------------------------------------------
