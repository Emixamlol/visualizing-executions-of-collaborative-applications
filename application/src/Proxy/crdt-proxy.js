import { crdt_handler } from './crdt-handler';
import { createCRDT } from './create-crdt';

export default class CrdtProxy {
  #crdt;
  #data;
  #updateData;

  constructor(id, crdt, params) {
    this.id = id;
    this.#crdt = new Proxy(createCRDT(crdt, params), crdt_handler);
    this.#data = [];

    this.#updateData = () => {};

    this.query = () => {
      switch (crdt) {
        case 'counter':
        case 'register':
          return this.#crdt.value();

        case 'set':
          return this.#crdt.lookup(arguments[0]);

        default:
          throw new Error('cannot query unvalid crdt');
      }
    };

    this.update = () => {
      name: switch (crdt) {
        case 'counter': {
          const update = arguments[0];
          switch (update) {
            case 'increment':
              this.#crdt.increment();
              break name;

            case 'decrement':
              this.#crdt.decrement();
              break name;
          }
        }

        case 'register': {
          const w = arguments[0];
          this.#crdt.assign(w);
          break name;
        }

        case 'set': {
          const [update, el] = arguments;
          switch (update) {
            case 'add':
              this.#crdt.add(el);
              break name;

            case 'remove':
              this.#crdt.remove(el);
          }
        }

        default:
          throw new Error('cannot update unvalid crdt');
      }
    };

    this.compare = (other) => this.#crdt.compare(other);

    this.merge = (other) => {
      this.#crdt.merge(other);
    };

    this.apply = () => {
      console.log('applying in crdtProxy');
    };

    this.getData = () => this.#data.slice(); // can only get copy of the data so that it cannot be changed directly
  }
}
