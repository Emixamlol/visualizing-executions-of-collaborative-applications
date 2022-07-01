import CRDTInterface from '../crdt';
import VectorClock from '../vector-clock';

interface RegisterInterface extends CRDTInterface<LWW_Register, any> {
  // update
  assign: (w: any) => void;

  // query
  value: () => any;

  // compare
  compare: (lwwr: LWW_Register) => boolean;
}

export default class LWW_Register implements RegisterInterface {
  private X: any; // value stored in register
  private pid: number; // id of the process handling the replica
  private timestamp: VectorClock;

  constructor(maxProcesses: number, pid: number) {
    this.X = undefined;
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  assign = (w: any): void => {
    this.X = w;
    this.timestamp.increase(this.pid);
  };

  value = (): any => this.X;

  compare = (lwwr: LWW_Register): boolean =>
    this.timestamp.lessOrEqual(lwwr.timestamp);

  merge = (lwwr: LWW_Register): LWW_Register => {
    const rr = new LWW_Register(this.timestamp.length, this.pid);
    if (this.compare(lwwr)) {
      rr.X = lwwr.X;
      rr.timestamp = lwwr.timestamp;
    } else {
      rr.X = this.X;
      rr.timestamp = this.timestamp;
    }
    rr.pid = this.pid;
    rr.timestamp = this.timestamp.merge(lwwr.timestamp);
    return rr;
  };

  payload = (): [any, number[]] => [this.X, this.getTimestamp()];

  getTimestamp = (): number[] => this.timestamp.getVector();
}
