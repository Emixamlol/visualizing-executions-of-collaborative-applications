import VectorClock from '../vector-clock';

export default class PN_counter {
  #P; // increments
  #N; // decrements
  #id; // id of the replica
  #pid; // id of the process handling the replica
  #timestamp; // vector clock

  constructor(n, pid) {
    this.#id = 0;
    this.#pid = pid;
    this.#timestamp = new VectorClock(n);
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
      this.#timestamp.increase(pid);
    };

    // update
    this.decrement = () => {
      let g = this.myID();
      this.#N[g]++;
      this.#timestamp.increase(pid);
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
        rc.#P[i] = Math.max(this.#P[i], pnc.#P[i]);
        rc.#N[i] = Math.max(this.#N[i], pnc.#N[i]);
      }
      rc.#pid = this.#pid;
      rc.#timestamp = this.#timestamp.merge(pnc.#timestamp);
      return rc;
    };
  }

  printClock = () => this.#timestamp.printClock();

  specificSate = () =>
    [
      this.value(),
      this.#id,
      this.#P,
      this.#N,
      this.#pid,
      this.#timestamp.printClock,
    ].slice(); // method to get the entire state of a counter
}
