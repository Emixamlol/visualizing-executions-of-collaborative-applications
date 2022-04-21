import { createCRDT } from './create-crdt';
import { createState } from './create-state';

export default class CrdtProxy {
  #crdt;
  #state;
  #replica;

  constructor(id, crdt, params) {
    this.id = id;
    this.#replica = id;
    this.#crdt =
      crdt !== undefined && params !== undefined
        ? createCRDT(crdt, params)
        : crdt;
    this.#state =
      crdt !== undefined && params !== undefined
        ? createState(crdt, params)
        : {};

    this.query = (...args) => {
      switch (crdt) {
        case 'counter':
        case 'register':
          return this.#crdt.value();

        case 'set':
          return this.#crdt.lookup(args[0]);

        default:
          throw new Error('cannot query invalid crdt');
      }
    };

    this.compare = (other) => this.#crdt.compare(other.#crdt);

    this.merge = (other) => {
      if (this.#replica === other.#replica) {
        const proxy = new CrdtProxy(this.id, crdt);
        proxy.#crdt = this.#crdt.merge(other.#crdt);
        proxy.#state = this.#state;
        return proxy;
      }
      return false;
    };

    this.apply = (fn, params) => {
      console.log('applying in crdtProxy');
      console.log(fn, params);
      this.#crdt[fn].apply(this.#crdt, params); // apply the function on the crdt
      return this.#updateState(crdt); // update the state and return it
    };

    this.replicate = (replicaId, pid) => {
      // create a copy replica of this crdt
      const [maxProcesses] = params;
      console.log(maxProcesses);
      if (pid < maxProcesses) {
        const newProxy = new CrdtProxy(replicaId, crdt);
        newProxy.#replica = this.#replica;
        newProxy.#crdt = createCRDT(crdt, [maxProcesses, pid]);
        newProxy.#state = this.#state;
        return newProxy;
      }
      return false; // if we reached the max number of processes, don't replicate the crdt
    };

    this.remove = () => {
      // removing a proxy simply sets the state color to red
      this.#state.color = 'red';
    };
  }

  // this method updates the state and returns a copy of it after the update
  #updateState = (crdt) => {
    switch (crdt) {
      case 'counter': {
        // this.#state.push();
        break;
      }

      case 'register':
        break;

      case 'set':
        break;

      default:
        break;
    }
    return this.getState();
  };

  getState = () => {
    return { ...this.#state }; // can only get copy of the data so that it cannot be changed directly
  };
}
