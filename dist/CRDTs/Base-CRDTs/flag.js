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
        this.value = () => Object.assign({}, this.flag);
        this.compare = (lwwf) => this.timestamp.lessOrEqual(lwwf.timestamp);
        this.payload = () => [
            JSON.stringify(this.flag),
            this.getTimestamp(),
        ];
        this.getTimestamp = () => this.timestamp.getVector();
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
