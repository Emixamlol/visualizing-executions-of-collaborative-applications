import { drawFlag } from '../../D3-framework';
import { CRDTInterface, CRDTtype } from '../../types/crdt-types';
import { basicParameters } from '../../types/d3-framework-types';
import VectorClock from '../vector-clock';

interface FlagInterface extends CRDTInterface {
  // updates
  enable(): void;

  disable(): void;

  // query
  value(): boolean;

  // compare
  compare(lwwf: LWW_Flag): boolean;
}

export default class LWW_Flag implements FlagInterface {
  private flag: boolean;
  private pid: number;
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.flag;

  constructor(maxProcesses: number, pid: number) {
    this.flag = true;
    this.pid = pid;
    this.timestamp = new VectorClock(maxProcesses);
  }

  enable = (): void => {
    this.flag = true;
    this.timestamp.increase(this.pid);
  };

  disable = (): void => {
    this.flag = false;
    this.timestamp.increase(this.pid);
  };

  value = (): boolean => JSON.parse(JSON.stringify(this.flag));

  compare = (lwwf: LWW_Flag): boolean =>
    this.timestamp.lessOrEqual(lwwf.timestamp);

  merge(lwwf: LWW_Flag): CRDTInterface {
    const rf = new LWW_Flag(this.timestamp.length, this.pid);
    this.compare(lwwf) ? (rf.flag = lwwf.flag) : (rf.flag = this.flag);
    rf.pid = this.pid;
    rf.timestamp = this.timestamp.merge(lwwf.timestamp);
    rf.timestamp.increase(this.pid);
    return rf;
  }

  payload = (): [string, number[]] => [
    JSON.stringify(this.flag),
    this.getTimestamp(),
  ];

  getTimestamp = (): number[] => this.timestamp.getVector();

  visualize = (params?: Array<basicParameters>): void => {
    const defaultParameters: basicParameters = {
      label: undefined,
      x: 0,
      y: 0,
      color: '',
      xMerge: 150,
      yMerge: 180,
    };
    drawFlag(
      params === undefined ? defaultParameters : params[0],
      this.value()
    );
  };
}
