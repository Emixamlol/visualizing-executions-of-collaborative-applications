export default class LWW_Register {
  #X;
  #t;
  static #timestamp = 0;

  constructor() {
    this.#X = undefined;
    this.#t = 0;

    // update
    this.assign = (w) => {
      this.#X = w;
      this.#t = ++LWW_Register.#timestamp;
    };

    // query
    this.value = () => this.#X;

    this.timestamp = () => this.#t;

    // compare
    this.compare = (lwwr) => this.#t <= lwwr.#t;

    // merge
    this.merge = (lwwr) => {
      const rr = new LWW_Register(); // the resulting register to be returned
      if (this.compare(lwwr)) {
        rr.#X = lwwr.#X;
        rr.#t = lwwr.#t;
      } else {
        rr.#X = this.#X;
        rr.#t = this.#t;
      }
      return rr;
    };
  }
}
