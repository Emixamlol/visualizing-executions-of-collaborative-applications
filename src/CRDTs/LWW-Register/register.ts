import { drawRegister } from '../../D3-framework';
import { CRDTtype, CRDTInterface } from '../../types/crdt-types';
import { basicParameters } from '../../types/d3-framework-types';
import VectorClock from '../vector-clock';

interface RegisterInterface extends CRDTInterface {
  // update
  assign(w: string): void;

  // query
  value(): string;

  // compare
  compare(lwwr: LWW_Register): boolean;
}

export default class LWW_Register implements RegisterInterface {
  private X: string; // value stored in register
  private pid: number; // id of the process handling the replica
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.register;

  constructor(maxProcesses: number, pid: number) {
    this.X = undefined;
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  assign = (w: string): void => {
    this.X = w;
    this.timestamp.increase(this.pid);
  };

  value = (): string => this.X;

  compare = (lwwr: LWW_Register): boolean =>
    this.timestamp.lessOrEqual(lwwr.timestamp);

  merge = (lwwr: LWW_Register): LWW_Register => {
    const rr = new LWW_Register(this.timestamp.length, this.pid);
    this.compare(lwwr) ? (rr.X = lwwr.X) : (rr.X = this.X);
    rr.pid = this.pid;
    rr.timestamp = this.timestamp.merge(lwwr.timestamp);
    rr.timestamp.increase(this.pid);
    return rr;
  };

  payload = (): [string, number[]] => [this.X, this.getTimestamp()];

  getTimestamp = (): number[] => this.timestamp.getVector();

  visualize = (params: Array<basicParameters>): void => {
    const defaultParameters: basicParameters = {
      label: 'register',
      x: 0,
      y: 0,
      color: '',
      xMerge: 100,
      yMerge: 165,
    };
    drawRegister(
      params === undefined ? defaultParameters : params[0],
      this.value(),
      this.getTimestamp()
    );
  };
}
