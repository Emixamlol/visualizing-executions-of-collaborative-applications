import VectorClock from '../vector-clock';

export default class TwoPhase_Set {
  #A;
  #R;
  #timestamp;
  #pid;
  constructor(maxProcesses, pid) {
    this.#timestamp = new VectorClock(maxProcesses);
    this.#pid = pid;
    this.#A = new Set([]);
    this.#R = new Set([]);

    // query
    this.lookup = (e) => this.#A.has(e) && !this.#R.has(e);

    // update
    this.add = (e) => {
      this.#A.add(e);
      this.#timestamp.increase(pid);
    };

    // update
    this.remove = (e) => {
      if (this.lookup(e)) this.#R.add(e);
      this.#timestamp.increase(pid);
    };

    // compare
    this.compare = (tps) =>
      this.#subset(this.#A, tps.#A) || this.#subset(this.#R, tps.#R);

    // merge
    this.merge = (tps) => {
      const rs = new TwoPhase_Set(); // the resulting set to be returned
      rs.#A = this.#union(this.#A, tps.#A);
      rs.#R = this.#union(this.#R, tps.#R);
      rs.#pid = this.#pid;
      rs.#timestamp = this.#timestamp.merge(tps.#timestamp);
      return rs;
    };
  }

  // help method to test if a set A is a subset of set B
  #subset = (A, B) => {
    if (A.size <= B) {
      A.forEach((e) => {
        if (!B.has(e)) return false;
      });
      return true;
    }
    return false;
  };

  // help method to get the union between two sets A and B
  #union = (A, B) => {
    if (A.size <= B.size) {
      A.forEach((e) => {
        B.add(e);
      });
      return B;
    } else {
      B.forEach((e) => {
        A.add(e);
      });
      return A;
    }
  };

  printClock = () => this.#timestamp.printClock();

  specificState = () => [];
}
