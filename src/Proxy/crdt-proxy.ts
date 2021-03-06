import { LWW_Register, PN_Counter, TwoPhase_Set } from '../CRDTs';
import { createCRDT } from '../CRDTs/create-crdt';
import { CRDTInterface, CRDTtype } from '../types/crdt-types';
import {
  ID,
  Message,
  ProxyInterface,
  StateInterface,
} from '../types/proxy-types';

export default class CrdtProxy implements ProxyInterface {
  readonly id: ID; // the id (name) of the local replica
  private replicaName: ID; // name of the original CRDT object the instance was replicated from
  private crdtReplica: CRDTInterface; // instance of CRDT replica the proxy contains
  private state: StateInterface; // the payload history and current payload of the CRDT replica

  constructor(id: ID, crdt: CRDTtype, params: string[]) {
    this.id = id;
    this.replicaName = id;
    this.crdtReplica = createCRDT(crdt, params);
    this.state = {
      history: [
        {
          msg: Message.initialized,
          payload: this.crdtReplica.payload(),
        },
      ],
      payload: this.crdtReplica.payload(),
      merges: [],
    };
  }

  // private method to update the state
  private updateState = (msg: Message): void => {
    const payload = this.crdtReplica.payload(); // get the current payload
    this.state = {
      // update the state with the new payload
      ...this.state,
      payload,
      history: this.state.history.concat({ msg, payload }),
    };
  };

  query = (args?: string[]): number | string | boolean => {
    switch (this.crdtReplica.type) {
      case CRDTtype.counter:
      case CRDTtype.register:
        return (this.crdtReplica as PN_Counter | LWW_Register).value();

      case CRDTtype.set:
        return (this.crdtReplica as TwoPhase_Set).lookup(args[0]);

      default:
        throw new Error('cannot query invalid crdt');
    }
  };

  merge = (other: CrdtProxy): void => {
    if (this.replicaName === other.replicaName) {
      this.crdtReplica = this.crdtReplica.merge(other.crdtReplica);
      this.state = {
        ...this.state,
        merges: this.state.merges.concat({
          from: {
            other_id: other.id,
            history_index: other.getState().history.length - 1,
          },
          to: this.state.history.length,
        }),
      };
      this.updateState(Message.merge);
    }
  };

  apply = (fn: string, params: string[]): void => {
    console.log(this);
    this.crdtReplica[fn].apply(this.crdtReplica, params);
    this.updateState(Message.update);
  };

  replicate = (replicaId: ID, pid: number): CrdtProxy => {
    const maxProcesses = this.crdtReplica.getTimestamp().length;
    if (pid < maxProcesses) {
      const newProxy = new CrdtProxy(replicaId, this.crdtReplica.type, [
        maxProcesses.toString(),
        pid.toString(),
      ]);
      newProxy.replicaName = this.replicaName; // the replicaName is the same for each replica
      newProxy.state = { ...this.state }; // the state is replicated as well
      return newProxy;
    }
    // in case the maximum number of possible replicas exist, do not replicate and return null
    return null;
  };

  getState = (): StateInterface => Object.assign({}, this.state); // return a copy of the state, not the state itself

  getType = (): CRDTtype => this.crdtReplica.type;
}
