import CrdtProxy from '../Proxy/crdt-proxy';
import RevisitedCrdtProxy from '../Proxy/revisited-crdt-proxy';
import { CRDTtype, payload } from './crdt-types';

// State
// ------------------------------------------------------------------------------

export enum Message {
  initialized = 'initialized',
  update = 'update',
  merge = 'merge',
}

type History = { msg: Message; payload: payload };

type Merge = { from: { other_id: ID; history_index: number }; to: number };

export interface StateInterface {
  history: Array<History>; // array of payload history with msg giving information on which operation was executed
  payload: payload; // payload of current state
  merges: Array<Merge>; // history of merges which have taken place
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

  visualize(): void;

  replicate(replicaId: ID, pid: number): CrdtProxy;

  getState(): StateInterface;

  getType(): CRDTtype;
}

// ------------------------------------------------------------------------------

// ------------------------------------------ revisited ------------------------------------------
export interface RevisitedProxyInterface {
  id: string;

  apply(op: 'query' | 'update', fn: string, params: string[]): void;

  merge(other: RevisitedCrdtProxy): void;

  replicate(replicaId: ID, pid: number): RevisitedCrdtProxy;

  getState(): StateInterface;

  // getUpdates()
}
