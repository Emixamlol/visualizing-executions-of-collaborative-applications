import { revisitedCreateCRDT } from '../CRDTs/create-crdt';
import RevisitedCounter from '../CRDTs/PN-Counter/revisited-counter';
import { CRDTtype, StateBasedInterface } from '../types/crdt-types';
import {
  ID,
  Message,
  RevisitedProxyInterface,
  StateInterface,
} from '../types/proxy-types';

export default class RevisitedCrdtProxy implements RevisitedProxyInterface {
  readonly id: ID; // the id (name) of the local replica
  private replicaName: ID; // name of the conceptual CRDT object the instance was replicated from
  private crdtReplica: StateBasedInterface<any, any, any>; // instance of CRDT replica the proxy contains
  private state: StateInterface; // the payload history and current payload of the CRDT replica

  constructor(id: ID, type: CRDTtype, params: string[]) {
    this.id = id;
    this.replicaName = id;
    this.crdtReplica = revisitedCreateCRDT(type, params);
    const [element, timestamp] = this.crdtReplica.getPayload();
    const payload: [string, number[]] = [
      JSON.stringify(element),
      timestamp.getVector(),
    ];
    this.state = {
      history: [
        {
          msg: Message.initialized,
          payload,
        },
      ],
      payload,
      merges: [],
    };
  }

  // private method to update the state
  private updateState = (msg: Message): void => {
    const [element, timestamp] = this.crdtReplica.getPayload(); // get the current payload
    const payload: [string, number[]] = [
      JSON.stringify(element),
      timestamp.getVector(),
    ];
    this.state = {
      // update the state with the new payload
      ...this.state,
      payload,
      history: this.state.history.concat({ msg, payload }),
    };
  };

  apply(op: 'query' | 'update', fn: string, params: string[]): void {
    this.crdtReplica[op][fn].apply(this.crdtReplica, params);
    this.updateState(Message.update);
  }

  merge = (other: RevisitedCrdtProxy): void => {
    if (this.replicaName === other.replicaName) {
      this.crdtReplica.merge(other.crdtReplica.getPayload());
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

  replicate = (replicaId: ID, pid: number): RevisitedCrdtProxy => {
    const maxProcesses = this.crdtReplica.getPayload()[1].length;
    if (pid < maxProcesses) {
      const newProxy = new RevisitedCrdtProxy(
        replicaId,
        this.crdtReplica.type,
        [maxProcesses.toString(), pid.toString()]
      );
      newProxy.replicaName = this.replicaName; // the replicaName is the same for each replica
      newProxy.state = { ...this.state }; // the state is replicated as well
      return newProxy;
    }
    // in case the maximum number of possible replicas exist, do not replicate and return null
    return null;
  };

  getState = (): StateInterface => Object.assign({}, this.state);
}
