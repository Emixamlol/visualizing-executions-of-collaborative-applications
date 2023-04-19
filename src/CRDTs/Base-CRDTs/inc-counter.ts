import { drawCounter, drawSet, drawTombstone } from '../../D3-framework';
import { CRDTInterface, CRDTtype, payload } from '../../types/crdt-types';
import { basicParameters } from '../../types/d3-framework-types';
import VectorClock from '../vector-clock';

interface Inc_CounterInterface extends CRDTInterface {
  // updates
  increment(): void;

  // query
  value(): void;

  // compare
  compare(ioc: Inc_Counter): boolean;
}

export default class Inc_Counter implements Inc_CounterInterface {
  private P: number[];
  private pid: number;
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.inc_counter;

  constructor(n: number, pid: number) {
    this.pid = pid;
    this.timestamp = new VectorClock(n);
    this.P = new Array(n).fill(0);
  }

  increment = (): void => {
    this.P[this.pid]++;
    this.timestamp.increase(this.pid);
  };

  value = (): number => this.P.reduce((acc, curr) => acc + curr);

  compare = (ioc: Inc_Counter): boolean =>
    this.P.reduce((acc, curr, idx) => acc && this.P[idx] <= ioc.P[idx], true);

  merge = (crdt: Inc_Counter): Inc_Counter => {
    const n = this.P.length;
    const rc = new Inc_Counter(n, this.pid);
    for (let i = 0; i < n; i++) {
      rc.P[i] = Math.max(this.P[i], crdt.P[i]);
    }
    rc.timestamp = this.timestamp.merge(crdt.timestamp);
    rc.timestamp.increase(this.pid);
    return rc;
  };

  payload = (): [string, number[]] => [
    this.value().toString(),
    this.getTimestamp(),
  ];

  getTimestamp = (): number[] => this.timestamp.getVector();

  visualize = (params?: basicParameters): void => {
    const defaultParameters: basicParameters = {
      label: 'inc-counter',
      x: 0,
      y: 0,
      color: '',
    };
    drawCounter(
      params === undefined ? defaultParameters : params,
      this.value(),
      this.P.slice()
    );
  };
}
