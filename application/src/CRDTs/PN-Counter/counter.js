import VectorClock from '../vector-clock';

export default class PN_counter {
  #P; // increments
  #N; // decrements
  #pid; // id of the process handling the replica
  #timestamp; // vector clock

  constructor(n, pid) {
    this.#pid = pid;
    this.#timestamp = new VectorClock(n);
    this.#P = new Array(n).fill(0);
    this.#N = new Array(n).fill(0);

    // update
    this.increment = () => {
      this.#P[this.#pid]++;
      this.#timestamp.increase(this.#pid);
    };

    // update
    this.decrement = () => {
      this.#N[this.#pid]++;
      this.#timestamp.increase(this.#pid);
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
      const rc = new PN_counter(n, pid);
      for (let i = 0; i < n; i++) {
        rc.#P[i] = Math.max(this.#P[i], pnc.#P[i]);
        rc.#N[i] = Math.max(this.#N[i], pnc.#N[i]);
      }
      rc.#pid = this.#pid;
      rc.#timestamp = this.#timestamp.merge(pnc.#timestamp);
      console.log(rc);
      return rc;
    };
  }

  // gives the payload of this replica
  payload = () => [this.value(), this.getTimestamp()];

  getTimestamp = () => this.#timestamp.getVector();

  specificSate = () =>
    [
      this.value(),
      this.#P.slice(),
      this.#N.slice(),
      this.#pid,
      this.#timestamp.getVector(),
    ].slice(); // method to get the entire state of a counter
}
