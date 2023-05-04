import { drawSet } from '../../D3-framework';
import { CRDTtype, CRDTInterface } from '../../types/crdt-types';
import { basicParameters } from '../../types/d3-framework-types';
import GrowOnly_Set from '../Base-CRDTs/grow-set';
import VectorClock from '../vector-clock';

interface SetInterface extends CRDTInterface {
  // updates
  add(e: string): void;

  remove(e: string): void;

  // query
  lookup(e: string): boolean;

  // compare
  compare(tps: TwoPhase_Set): boolean;
}

export default class TwoPhase_Set implements SetInterface {
  private A: GrowOnly_Set;
  private R: GrowOnly_Set;
  private pid: number;
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.set;

  constructor(maxProcesses: number, pid: number) {
    this.A = new GrowOnly_Set(maxProcesses, pid);
    this.R = new GrowOnly_Set(maxProcesses, pid);
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

  lookup = (e: string): boolean => this.A.lookup(e) && !this.R.lookup(e);

  compare = (tps: TwoPhase_Set): boolean =>
    this.A.compare(tps.A) || this.R.compare(tps.R);

  merge = (tps: TwoPhase_Set): TwoPhase_Set => {
    const rs = new TwoPhase_Set(this.timestamp.length, this.pid); // the resulting set to be returned
    rs.A = this.A.merge(tps.A);
    rs.R = this.R.merge(tps.R);
    rs.pid = this.pid;
    rs.timestamp = this.timestamp.merge(tps.timestamp);
    rs.timestamp.increase(this.pid);
    return rs;
  };

  // gives the payload of this replica
  payload = (): [string, number[]] => {
    const ASet: Array<String> = this.A.payload()[0].split(',');
    const RSet: Array<String> = this.R.payload()[0].split(',');
    return [
      ASet.filter((e) => !RSet.includes(e)).toString(),
      this.getTimestamp(),
    ];
  };

  getTimestamp = (): number[] => this.timestamp.getVector();

  visualize = (params: Array<basicParameters>): void => {
    this.A.visualize([
      {
        label: 'A',
        x: 0,
        y: 0,
        color: 'blue',
        xMerge: 0,
        yMerge: 0,
      },
    ]);
    this.R.visualize([
      {
        label: 'R',
        x: 400,
        y: 0,
        color: 'red',
        xMerge: 0,
        yMerge: 0,
      },
    ]);
  };
}
