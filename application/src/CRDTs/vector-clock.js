// vector clock used as timestamp for the crdts
export default class VectorClock {
  #vector;
  constructor(n) {
    this.length = n;
    this.#vector = new Array(n).fill(0);

    this.increase = (pid) => {
      this.#vector[pid]++;
    };

    this.merge = (vc) => {
      const rvc = new VectorClock();
      for (let i = 0; i < n; i++) {
        rvc.#vector[i] = Math.max(this.#vector[i], vc.#vector[i]);
      }
      return rvc;
    };

    this.isEqual = (vc) => {
      for (let i = 0; i < n; i++) {
        if (this.#vector[i] !== vc.#vector[i]) return false;
      }
      return true;
    };

    this.lessOrEqual = (vc) => {
      for (let i = 0; i < n; i++) {
        for (let i = 0; i < n; i++) {
          if (this.#vector[i] > vc.#vector[i]) return false;
        }
        return true;
      }
    };

    this.less = (vc) => {
      for (let i = 0; i < n; i++) {
        if (
          this.#vector[i] > vc.#vector[i] ||
          this.#vector[i] === vc.#vector[i]
        )
          return false;
      }
      return true;
    };

    this.printClock = () => JSON.stringify(this.#vector);
  }
}
