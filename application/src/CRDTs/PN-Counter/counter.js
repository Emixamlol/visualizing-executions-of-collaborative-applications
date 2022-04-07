export default class PN_counter {
  #P;
  #N;
  #id;
  constructor(n) {
    this.#id = 0;
    this.#P = new Array(n).fill(0);
    this.#N = new Array(n).fill(0);

    // help method to get the replica's id
    this.myID = () => {
      let res = this.#id;
      this.#id = (this.#id + 1) % n;
      return res;
    };

    // update
    this.increment = () => {
      let g = this.myID();
      this.#P[g]++;
    };

    // update
    this.decrement = () => {
      let g = this.myID();
      this.#N[g]++;
    };

    // query
    this.value = () => {
      let incSum = 0;
      let decSum = 0;
      for (let i = 0; i < n; i++) {
        incSum += this.#P[i];
        decSum += this.#N[i];
      }
      return incSum - decSum;
    };

    // compare
    this.compare = (pnc) => {
      for (let i = 0; i < n; i++) {
        if (this.#P[i] > pnc.#P[i] || this.#N[i] > pnc.#N[i]) return false;
      }
      return true;
    };

    // merge
    this.merge = (pnc) => {
      const rc = new PN_counter(n);
      for (let i = 0; i < n; i++) {
        rc.#P[i] = this.#max(this.#P[i], pnc.#P[i]);
        rc.#N[i] = this.#max(this.#N[i], pnc.#N[i]);
      }
      return rc;
    };
  }

  // help method to get the maximum between two numbers
  #max = (a, b) => (a > b ? a : b);

  specificSate = () => [this.value(), this.#id, this.#P, this.#N].slice(); // method to get the entire state of a counter
}
