import CRDTInterface from '../crdt';
import VectorClock from '../vector-clock';

interface PN_CounterInterface extends CRDTInterface<PN_Counter, number> {
  // updates
  increment: () => void;

  decrement: () => void;

  // query
  value: () => number;

  // compare
  compare: (pnc: PN_Counter) => boolean;
}

export default class PN_Counter implements PN_CounterInterface {
  private P: number[]; // increments
  private N: number[]; // decrements
  private pid: number; // id of the process handling the replica
  private timestamp: VectorClock; // vector clock

  constructor(n: number, pid: number) {
    this.pid = pid;
    this.timestamp = new VectorClock(n);
    this.P = new Array(n).fill(0);
    this.N = new Array(n).fill(0);
  }

  increment = (): void => {
    this.P[this.pid]++;
    this.timestamp.increase(this.pid);
  };

  decrement = (): void => {
    this.N[this.pid]++;
    this.timestamp.increase(this.pid);
  };

  value = (): number => {
    let incSum = 0;
    let decSum = 0;
    for (let i = 0; i < this.P.length; i++) {
      incSum += this.P[i];
      decSum += this.N[i];
    }
    return incSum - decSum;
  };

  compare = (pnc: PN_Counter): boolean => {
    for (let i = 0; i < this.P.length; i++) {
      if (this.P[i] > pnc.P[i] || this.N[i] > pnc.N[i]) return false;
    }
    return true;
  };

  merge = (pnc: PN_Counter): PN_Counter => {
    const n = this.P.length;
    const rc = new PN_Counter(n, this.pid);
    for (let i = 0; i < n; i++) {
      rc.P[i] = Math.max(this.P[i], pnc.P[i]);
      rc.N[i] = Math.max(this.N[i], pnc.N[i]);
    }
    rc.timestamp = this.timestamp.merge(pnc.timestamp);
    console.log(rc);
    return rc;
  };

  payload = (): [number, number[]] => [this.value(), this.getTimestamp()];

  getTimestamp = (): number[] => this.timestamp.getVector();

  specificState = (): (number | number[])[] => [
    this.value(),
    this.P.slice(),
    this.N.slice(),
    this.pid,
    this.timestamp.getVector(),
  ];
}
