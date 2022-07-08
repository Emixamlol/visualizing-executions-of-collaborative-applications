import { createCRDT } from '../CRDTs/create-crdt';
import { CRDT, crdt } from '../types/crdt-types';
import {
  colorGenerator,
  Msg,
  ProxyInterface,
  StateInterface,
} from '../types/proxy-types';

export default class CrdtProxy<T> implements ProxyInterface<T> {
  readonly id: string; // the id (name) of the local replica
  protected replicaName: string; // name of the CRDT object the instance represents
  private crdtReplica: crdt; // instance of CRDT replica the proxy contains
  private state: StateInterface; // the state of the CRDT replica

  constructor(id: string, crdt: CRDT, params: string[]) {
    this.id = id;
    this.replicaName = id;
    this.crdtReplica = createCRDT(crdt, params);
    this.state = {
      history: [
        {
          msg: Msg.initialized,
          payload: this.crdtReplica.payload(),
        },
      ],
      payload: this.crdtReplica.payload(),
      color: colorGenerator.next().value,
    };
  }

  query = (...args: string[]): T => {
    switch (this.crdtReplica.type) {
      case CRDT.counter:
      case CRDT.register:
        return this.crdtReplica.value() as unknown as T;

      case CRDT.set:
        return this.crdtReplica.lookup(args[0]) as unknown as T;

      default:
        throw new Error('cannot query invalid crdt');
    }
  };

  compare: (other: CrdtProxy<T>) => boolean;

  merge: (other: CrdtProxy<T>) => crdt;

  apply: (crdtReplica: CrdtProxy<T>) => void;

  replicate: (replicaId: number) => CrdtProxy<T>;
}
