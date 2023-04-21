import { drawSet } from '../../D3-framework';
import { CRDTtype } from '../../types/crdt-types';
import Inc_Counter from '../Base-CRDTs/inc-counter';
import VectorClock from '../vector-clock';
export default class PN_Counter {
    constructor(n, pid) {
        this.type = CRDTtype.counter;
        this.increment = () => {
            this.P.increment();
            this.timestamp.increase(this.pid);
        };
        this.decrement = () => {
            this.N.increment();
            this.timestamp.increase(this.pid);
        };
        this.value = () => this.P.value() - this.N.value();
        this.compare = (pnc) => this.P.compare(pnc.P) && this.N.compare(pnc.N);
        this.merge = (pnc) => {
            const n = this.timestamp.length;
            const rc = new PN_Counter(n, this.pid);
            rc.P = this.P.merge(pnc.P);
            rc.N = this.N.merge(pnc.N);
            rc.timestamp = this.timestamp.merge(pnc.timestamp);
            rc.timestamp.increase(this.pid);
            return rc;
        };
        this.payload = () => [
            this.value().toString(),
            this.getTimestamp(),
        ];
        this.getTimestamp = () => this.timestamp.getVector();
        this.specificState = () => [
            this.value(),
            this.P.getTimestamp(),
            this.N.getTimestamp(),
            this.pid,
            this.timestamp.getVector(),
        ];
        this.visualize = (params) => {
            drawSet({
                label: 'Value',
                x: -35,
                y: 0,
                color: undefined,
                xMerge: 0,
                yMerge: 0,
            }, [this.value().toString()]);
            this.P.visualize({
                label: 'P',
                x: 60,
                y: 0,
                color: 'green',
                xMerge: 0,
                yMerge: 0,
            });
            this.N.visualize({
                label: 'N',
                x: 460,
                y: 0,
                color: 'blue',
                xMerge: 0,
                yMerge: 0,
            });
        };
        this.pid = pid;
        this.timestamp = new VectorClock(n);
        this.P = new Inc_Counter(n, pid);
        this.N = new Inc_Counter(n, pid);
    }
}
