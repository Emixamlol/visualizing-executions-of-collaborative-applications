import VectorClock from '../vector-clock';

export default class LWW_Register {
  #X; // value stored in the register
  #t; // timestamp (vector clock)
  #pid; // id of the process handling the replica

  constructor(maxProcesses, pid) {
    this.#X = undefined;
    this.#t = new VectorClock(maxProcesses);
    this.#pid = pid;

    // update
    this.assign = (w) => {
      this.#X = w;
      this.#t.increase(this.#pid);
    };

    // query
    this.value = () => this.#X;

    // compare
    this.compare = (lwwr) => this.#t.lessOrEqual(lwwr.#t);

    // merge
    this.merge = (lwwr) => {
      const rr = new LWW_Register(maxProcesses, pid); // the resulting register to be returned
      if (this.compare(lwwr)) {
        rr.#X = lwwr.#X;
        rr.#t = lwwr.#t;
      } else {
        rr.#X = this.#X;
        rr.#t = this.#t;
      }
      rr.#pid = this.#pid;
      rr.#t = this.#t.merge(lwwr.#t);
      return rr;
    };
  }

  // gives the payload of this replica
  payload = () => [this.#X, this.getTimestamp()];

  getTimestamp = () => this.#t.getVector();

  specificState = () => [];
}
