import { CRDTInterface } from '../../types';
import VectorClock from '../vector-clock';

interface SetInterface<T> extends CRDTInterface<TwoPhase_Set<T>> {
  // updates
  add: (e: T) => void;

  remove: (e: T) => void;

  // query
  lookup: (e: T) => boolean;

  // compare
  compare: (tps: TwoPhase_Set<T>) => boolean;
}

export default class TwoPhase_Set<T> implements SetInterface<T> {
  private A: Set<T>;
  private R: Set<T>;
  private pid: number;
  private timestamp: VectorClock;

  constructor(maxProcesses: number, pid: number) {
    this.A = new Set([]);
    this.R = new Set([]);
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  add = (e: T): void => {
    this.A.add(e);
    this.timestamp.increase(this.pid);
  };

  remove = (e: T): void => {
    if (this.lookup(e)) this.R.add(e);
    this.timestamp.increase(this.pid);
  };

  lookup = (e: T): boolean => this.A.has(e) && !this.R.has(e);

  private subset = (A: Set<T>, B: Set<T>): boolean => {
    if (A.size <= B.size) {
      A.forEach((e) => {
        if (!B.has(e)) return false;
      });
      return true;
    }
    return false;
  };

  compare = (tps: TwoPhase_Set<T>): boolean =>
    this.subset(this.A, tps.A) || this.subset(this.R, tps.R);

  private union = (A: Set<T>, B: Set<T>): Set<T> => {
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

  merge = (tps: TwoPhase_Set<T>): TwoPhase_Set<T> => {
    const rs = new TwoPhase_Set<T>(this.timestamp.length, this.pid); // the resulting set to be returned
    rs.A = this.union(this.A, tps.A);
    rs.R = this.union(this.R, tps.R);
    rs.pid = this.pid;
    rs.timestamp = this.timestamp.merge(tps.timestamp);
    return rs;
  };

  // gives the payload of this replia
  payload = (): [string, number[]] => {
    const result = new Set(Array.from(this.A));
    this.R.forEach((e) => result.delete(e));
    return [Array.from(result).toString(), this.getTimestamp()];
  };

  getTimestamp = (): number[] => this.timestamp.getVector();
}
