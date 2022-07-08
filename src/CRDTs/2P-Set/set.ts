import { CRDT, CRDTInterface } from '../../types/crdt-types';
import VectorClock from '../vector-clock';

interface SetInterface extends CRDTInterface<TwoPhase_Set> {
  // updates
  add: (e: string) => void;

  remove: (e: string) => void;

  // query
  lookup: (e: string) => boolean;

  // compare
  compare: (tps: TwoPhase_Set) => boolean;
}

export default class TwoPhase_Set implements SetInterface {
  private A: Set<string>;
  private R: Set<string>;
  private pid: number;
  private timestamp: VectorClock;
  type: CRDT.set;

  constructor(maxProcesses: number, pid: number) {
    this.A = new Set([]);
    this.R = new Set([]);
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  add = (e: string): void => {
    this.A.add(e);
    this.timestamp.increase(this.pid);
  };

  remove = (e: string): void => {
    if (this.lookup(e)) this.R.add(e);
    this.timestamp.increase(this.pid);
  };

  lookup = (e: string): boolean => this.A.has(e) && !this.R.has(e);

  private subset = (A: Set<string>, B: Set<string>): boolean => {
    if (A.size <= B.size) {
      A.forEach((e) => {
        if (!B.has(e)) return false;
      });
      return true;
    }
    return false;
  };

  compare = (tps: TwoPhase_Set): boolean =>
    this.subset(this.A, tps.A) || this.subset(this.R, tps.R);

  private union = (A: Set<string>, B: Set<string>): Set<string> => {
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

  merge = (tps: TwoPhase_Set): TwoPhase_Set => {
    const rs = new TwoPhase_Set(this.timestamp.length, this.pid); // the resulting set to be returned
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
