import { CRDTtype } from '../../types/crdt-types';
import VectorClock from '../vector-clock';
export default class RevisitedCounter {
    constructor(n, pid) {
        this.payload = { P: [], N: [] };
        this.type = CRDTtype.counter;
        this.query = {
            value: () => {
                let incSum = 0;
                let decSum = 0;
                for (let i = 0; i < this.payload.P.length; i++) {
                    incSum += this.payload.P[i];
                    decSum += this.payload.N[i];
                }
                return incSum - decSum;
            },
        };
        this.update = {
            increment: () => {
                this.payload.P[this.pid]++;
                this.timestamp.increase(this.pid);
            },
            decrement: () => {
                this.payload.N[this.pid]++;
                this.timestamp.increase(this.pid);
            },
        };
        this.compare = (other) => {
            for (let i = 0; i < this.payload.P.length; i++) {
                if (this.payload.P[i] > other.payload.P[i] ||
                    this.payload.N[i] > other.payload.N[i])
                    return false;
            }
            return true;
        };
        this.merge = (other) => {
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
        this.getPayload = () => [
            Object.assign({}, this.payload),
            Object.assign({}, this.timestamp),
        ];
        this.pid = pid;
        this.timestamp = new VectorClock(n);
        this.payload.P = new Array(n).fill(0);
        this.payload.N = new Array(n).fill(0);
    }
}
