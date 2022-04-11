import { createCRDT } from './create-crdt';

export default class CrdtProxy {
  #crdt;
  #state;

  constructor(id, crdt, params) {
    this.id = id;
    this.#crdt = crdt !== undefined ? createCRDT(crdt, params) : crdt;
    this.#state = {};

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
      const proxy = new CrdtProxy(this.id);
      proxy.#crdt = this.#crdt.merge(other.#crdt);
      return proxy;
    };

    this.apply = (fn, params) => {
      console.log('applying in crdtProxy');
      console.log(fn, params);
      this.#crdt[fn].apply(this.#crdt, params); // apply the function on the crdt
      return this.#updateState(crdt); // update the state and return it
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
