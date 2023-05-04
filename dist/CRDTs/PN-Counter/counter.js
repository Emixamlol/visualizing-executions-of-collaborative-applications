import { drawSingleValue } from '../../D3-framework';
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
            drawSingleValue({
                label: 'Value',
                x: -80,
                y: 0,
                color: undefined,
                xMerge: 60,
                yMerge: 160,
            }, this.value());
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
        this.pid = pid;
        this.timestamp = new VectorClock(n);
        this.P = new Inc_Counter(n, pid);
        this.N = new Inc_Counter(n, pid);
    }
}
