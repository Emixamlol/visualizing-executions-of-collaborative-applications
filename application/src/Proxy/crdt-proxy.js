import { createCRDT } from './create-crdt';

export default class CrdtProxy {
  #crdt;
  #state;

  constructor(id, crdt, params) {
    this.id = id;
    this.#crdt = crdt !== undefined ? createCRDT(crdt, params) : crdt;
    this.#state = [];

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
      const crdt = this.#crdt.merge(other.#crdt);
      const proxy = new CrdtProxy();
      proxy.id = this.id;
      proxy.#crdt = crdt;
      return proxy;
    };

    this.apply = (fn, params) => {
      console.log('applying in crdtProxy');
      this.#crdt[fn].apply(params); // apply the function
      return this.#updateState(); // update the state and return it
    };
  }

  // this method updates the state and returns a copy of it after the update
  #updateState = (crdt) => {
    switch (crdt) {
      case 'counter':
        this.#state.push();
        break;

      case 'register':
        break;

      case 'set':
        break;

      default:
        break;
    }
    return this.getState();
  };

  getState = () => this.#state.slice(); // can only get copy of the data so that it cannot be changed directly
}
