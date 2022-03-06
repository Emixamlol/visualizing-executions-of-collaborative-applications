export default class TwoPhase_Set {
  #A;
  #R;
  constructor() {
    this.#A = new Set([]);
    this.#R = new Set([]);

    // query
    this.lookup = (e) => this.#A.has(e) && !this.#R.has(e);

    // update
    this.add = (e) => this.#A.add(e);

    // update
    this.remove = (e) => {
      if (this.lookup(e)) this.#R.add(e);
    };

    // help method to test if a set A is a subset of set B
    this.subset = (A, B) => {
      if (A.size() <= B) {
        A.forEach((e) => {
          if (!B.has(e)) return false;
        });
        return true;
      }
      return false;
    };

    // compare
    this.compare = (tps) =>
      this.subset(this.#A, tps.#A) || this.subset(this.#R, tps.#R);

    // help method to get the union between two sets A and B
    this.union = (A, B) => {
      if (A.size() <= B.size()) {
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

    // merge
    this.merge = (tps) => {
      const rs = new TwoPhase_Set(); // the resulting set to be returned
      rs.#A = this.union(this.#A, tps.#A);
      rs.#R = this.union(this.#R, tps.#R);
      return rs;
    };
  }
}
