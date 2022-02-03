class LWW_Register {
  #X;
  #t;
  constructor() {
    this.#X = undefined;
    this.#t = 0;

    // update
    this.assign = function (w) {
      this.#X = w;
      this.#t = Date.now();
    };

    // query
    this.value = function () {
      return this.#X;
    };

    // compare
    this.compare = function (lwwr) {
      return this.#t <= lwwr.#t;
    };

    // merge
    this.merge = function (lwwr) {
      const rr = new LWW_Register(); // the resulting register to be returned
      if (this.#t <= lwwr.#t) {
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
