import { drawCounter, drawSet, drawSingleValue } from '../../D3-framework';
import { CRDTtype, CRDTInterface } from '../../types/crdt-types';
import { basicParameters } from '../../types/d3-framework-types';
import Inc_Counter from '../Base-CRDTs/inc-counter';
import VectorClock from '../vector-clock';

interface PN_CounterInterface extends CRDTInterface {
  // updates
  increment(): void;

  decrement(): void;

  // query
  value(): number;

  // compare
  compare(pnc: PN_Counter): boolean;
}

export default class PN_Counter implements PN_CounterInterface {
  private P: Inc_Counter; // increments
  private N: Inc_Counter; // decrements
  private pid: number; // id of the process handling the replica
  private timestamp: VectorClock; // vector clock
  type: CRDTtype = CRDTtype.counter;

  constructor(n: number, pid: number) {
    this.pid = pid;
    this.timestamp = new VectorClock(n);
    this.P = new Inc_Counter(n, pid);
    this.N = new Inc_Counter(n, pid);
  }

  increment = (): void => {
    this.P.increment();
    this.timestamp.increase(this.pid);
  };

  decrement = (): void => {
    this.N.increment();
    this.timestamp.increase(this.pid);
  };

  value = (): number => this.P.value() - this.N.value();

  compare = (pnc: PN_Counter): boolean =>
    this.P.compare(pnc.P) && this.N.compare(pnc.N);

  merge = (pnc: PN_Counter): PN_Counter => {
    const n = this.timestamp.length;
    const rc = new PN_Counter(n, this.pid);
    rc.P = this.P.merge(pnc.P);
    rc.N = this.N.merge(pnc.N);
    rc.timestamp = this.timestamp.merge(pnc.timestamp);
    rc.timestamp.increase(this.pid);
    return rc;
  };

  payload = (): [string, number[]] => [
    this.value().toString(),
    this.getTimestamp(),
  ];

  getTimestamp = (): number[] => this.timestamp.getVector();

  specificState = (): (number | number[])[] => [
    this.value(),
    this.P.getTimestamp(),
    this.N.getTimestamp(),
    this.pid,
    this.timestamp.getVector(),
  ];

  visualize = (params?: Array<basicParameters>): void => {
    drawSingleValue(
      {
        label: 'Value',
        x: -80,
        y: 0,
        color: undefined,
        xMerge: 60,
        yMerge: 160,
      },
      this.value()
    );
    this.P.visualize([
      {
        label: 'P',
        x: 40,
        y: 0,
        color: 'green',
        xMerge: 60,
        yMerge: 200,
      },
    ]);
    this.N.visualize([
      {
        label: 'N',
        x: 440,
        y: 0,
        color: 'blue',
        xMerge: 60,
        yMerge: 240,
      },
    ]);
  };
}
