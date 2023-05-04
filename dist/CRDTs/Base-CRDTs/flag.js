import { drawFlag } from '../../D3-framework';
import { CRDTtype } from '../../types/crdt-types';
import VectorClock from '../vector-clock';
export default class LWW_Flag {
    constructor(maxProcesses, pid) {
        this.type = CRDTtype.flag;
        this.enable = () => {
            this.flag = true;
            this.timestamp.increase(this.pid);
        };
        this.disable = () => {
            this.flag = false;
            this.timestamp.increase(this.pid);
        };
        this.value = () => JSON.parse(JSON.stringify(this.flag));
        this.compare = (lwwf) => this.timestamp.lessOrEqual(lwwf.timestamp);
        this.payload = () => [
            JSON.stringify(this.flag),
            this.getTimestamp(),
        ];
        this.getTimestamp = () => this.timestamp.getVector();
        this.visualize = (params) => {
            const defaultParameters = {
                label: undefined,
                x: 0,
                y: 0,
                color: '',
                xMerge: 150,
                yMerge: 180,
            };
            drawFlag(params === undefined ? defaultParameters : params[0], this.value());
        };
        this.flag = true;
        this.pid = pid;
        this.timestamp = new VectorClock(maxProcesses);
    }
    merge(lwwf) {
        const rf = new LWW_Flag(this.timestamp.length, this.pid);
        this.compare(lwwf) ? (rf.flag = lwwf.flag) : (rf.flag = this.flag);
        rf.pid = this.pid;
        rf.timestamp = this.timestamp.merge(lwwf.timestamp);
        rf.timestamp.increase(this.pid);
        return rf;
    }
}
