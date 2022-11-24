import { CRDTInterface, CRDTtype } from '../../types/crdt-types';
import VectorClock from '../vector-clock';

interface SetInterface extends CRDTInterface {
  // updates
  add(e: string): void;

  // query
  lookup(e: string): boolean;

  // compare
  compare(tps: GrowOnly_Set): boolean;
}

export default class GrowOnly_Set implements SetInterface {
  private A: Set<string>;
  private pid: number;
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.set;

  constructor(maxProcesses: number, pid: number) {
    this.A = new Set([]);
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  add = (e: string): void => {
    this.A.add(e);
    this.timestamp.increase(this.pid);
  };

  lookup = (e: string): boolean => this.A.has(e);

  private subset = (A: Set<string>, B: Set<string>): boolean => {
    if (A.size <= B.size) {
      A.forEach((e) => {
        if (!B.has(e)) return false;
      });
      return true;
    }
    return false;
  };

  compare = (gos: GrowOnly_Set): boolean => this.subset(this.A, gos.A);

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

  merge = (gos: GrowOnly_Set): GrowOnly_Set => {
    const rs = new GrowOnly_Set(this.timestamp.length, this.pid); // the resulting set to be returned
    rs.A = this.union(this.A, gos.A);
    rs.pid = this.pid;
    rs.timestamp = this.timestamp.merge(gos.timestamp);
    rs.timestamp.increase(this.pid);
    return rs;
  };

  payload = (): [string, number[]] => {
    const result = new Set(Array.from(this.A));
    return [Array.from(result).toString(), this.getTimestamp()];
  };

  getTimestamp = (): number[] => this.timestamp.getVector();
}