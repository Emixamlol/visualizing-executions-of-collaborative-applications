import { CRDT, crdt } from '../types/crdt-types';
import { ProxyInterface, StateInterface } from '../types/proxy-types';

export default class CrdtProxy<T> implements ProxyInterface<T> {
  readonly id: string; // the id (name) of the local replica
  protected replicaName: string; // name of the CRDT object the instance represents
  private crdtReplica: crdt; // instance of CRDT replica the proxy contains
  private state: StateInterface<T>; // the state of the CRDT replica

  constructor(id: string, crdt: CRDT, params: string[]) {
    this.id = id;
    this.replicaName = id;
    // this.crdtReplica =
  }

  query: (...args: string[]) => T;

  compare: (other: T) => boolean;

  merge: (other: T) => T;

  apply: (crdtReplica: T) => void;

  replicate: (replicaId: number) => T;
}
