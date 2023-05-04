import { drawCounter } from '../../D3-framework';
import { CRDTtype } from '../../types/crdt-types';
import VectorClock from '../vector-clock';
export default class Inc_Counter {
    constructor(n, pid) {
        this.type = CRDTtype.inc_counter;
        this.increment = () => {
            this.P[this.pid]++;
            this.timestamp.increase(this.pid);
        };
        this.value = () => this.P.reduce((acc, curr) => acc + curr);
        this.compare = (ioc) => this.P.reduce((acc, curr, idx) => acc && this.P[idx] <= ioc.P[idx], true);
        this.merge = (crdt) => {
            const n = this.P.length;
            const rc = new Inc_Counter(n, this.pid);
            for (let i = 0; i < n; i++) {
                rc.P[i] = Math.max(this.P[i], crdt.P[i]);
            }
            rc.timestamp = this.timestamp.merge(crdt.timestamp);
            rc.timestamp.increase(this.pid);
            return rc;
        };
        this.payload = () => [
            this.value().toString(),
            this.getTimestamp(),
        ];
        this.getTimestamp = () => this.timestamp.getVector();
        this.visualize = (params) => {
            const defaultParameters = {
                label: 'P',
                x: 0,
                y: 0,
                color: undefined,
                xMerge: 0,
                yMerge: 0,
            };
            drawCounter(params === undefined ? defaultParameters : params[0], this.value(), this.P.slice());
        };
        this.pid = pid;
        this.timestamp = new VectorClock(n);
        this.P = new Array(n).fill(0);
    }
}
