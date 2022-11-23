import { CRDTtype, StateBasedInterface } from '../../types/crdt-types';
import VectorClock from '../vector-clock';

interface PayloadInterface {
  P: Array<number>;
  N: Array<number>;
}

interface QueryInterface {
  value(): number;
}

interface UpdateInterface {
  increment(): void;

  decrement(): void;
}

export default class RevisitedCounter
  implements
    StateBasedInterface<PayloadInterface, QueryInterface, UpdateInterface>
{
  private payload: PayloadInterface = { P: [], N: [] };
  private pid: number; // id of the process handling the replica
  private timestamp: VectorClock;
  type: CRDTtype = CRDTtype.counter;

  constructor(n: number, pid: number) {
    this.pid = pid;
    this.timestamp = new VectorClock(n);
    this.payload.P = new Array(n).fill(0);
    this.payload.N = new Array(n).fill(0);
  }

  query: QueryInterface = {
    value: (): number => {
      let incSum = 0;
      let decSum = 0;
      for (let i = 0; i < this.payload.P.length; i++) {
        incSum += this.payload.P[i];
        decSum += this.payload.N[i];
      }
      return incSum - decSum;
    },
  };

  update: UpdateInterface = {
    increment: (): void => {
      this.payload.P[this.pid]++;
      this.timestamp.increase(this.pid);
    },

    decrement: (): void => {
      this.payload.N[this.pid]++;
      this.timestamp.increase(this.pid);
    },
  };

  compare = (other: RevisitedCounter): boolean => {
    for (let i = 0; i < this.payload.P.length; i++) {
      if (
        this.payload.P[i] > other.payload.P[i] ||
        this.payload.N[i] > other.payload.N[i]
      )
        return false;
    }
    return true;
  };

  merge = (other: RevisitedCounter): PayloadInterface => {
    const n = this.payload.P.length;
    const rp = Object.assign({}, this.payload);
    const [op, ot] = other.getPayload();
    for (let i = 0; i < n; i++) {
      rp.P[i] = Math.max(this.payload.P[i], op.P[i]);
      rp.N[i] = Math.max(this.payload.N[i], op.N[i]);
    }
    this.timestamp = this.timestamp.merge(ot);
    this.timestamp.increase(this.pid);
    this.payload = rp;
    return rp;
  };

  // compare = (other: PayloadInterface): boolean => {
  //   for (let i = 0; i < this.payload.P.length; i++) {
  //     if (this.payload.P[i] > other.P[i] || this.payload.N[i] > other.N[i])
  //       return false;
  //   }
  //   return true;
  // };

  // merge = (other: [PayloadInterface, VectorClock]): PayloadInterface => {
  //   const n = this.payload.P.length;
  //   const rp = Object.assign({}, this.payload);
  //   const [op, ot] = other;
  //   for (let i = 0; i < n; i++) {
  //     rp.P[i] = Math.max(this.payload.P[i], op.P[i]);
  //     rp.N[i] = Math.max(this.payload.N[i], op.N[i]);
  //   }
  //   this.timestamp = this.timestamp.merge(ot);
  //   this.timestamp.increase(this.pid);
  //   this.payload = rp;
  //   return rp;
  // };

  getPayload = (): [PayloadInterface, VectorClock] => [
    Object.assign({}, this.payload),
    Object.assign({}, this.timestamp),
  ];
}
