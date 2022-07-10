import CrdtProxy from '../Proxy/crdt-proxy';
import { payload } from './crdt-types';

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

export enum Message {
  initialized = 'initialized',
  update = 'update',
  merge = 'merge',
}

// the type parameter T is the type of the payload
interface HistoryInterface {
  msg: Message;
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

export type ID = string;

export enum ProxyMethod {
  new = 'new',
  query = 'query',
  delete = 'delete',
  replicate = 'replicate',
  merge = 'merge',
  apply = 'apply',
}

export interface ProxyInterface {
  id: string;

  query(args?: string[]): number | string | boolean;

  merge(other: CrdtProxy): void;

  apply(fn: string, params: string[]): void;

  replicate(replicaId: ID, pid: number): CrdtProxy;
}

// ------------------------------------------------------------------------------
