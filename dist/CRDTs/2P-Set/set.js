import { CRDTtype } from '../../types/crdt-types';
import GrowOnly_Set from '../Base-CRDTs/grow-set';
import VectorClock from '../vector-clock';
export default class TwoPhase_Set {
    constructor(maxProcesses, pid) {
        this.type = CRDTtype.set;
        this.add = (e) => {
            this.A.add(e);
            this.timestamp.increase(this.pid);
        };
        this.remove = (e) => {
            if (this.lookup(e))
                this.R.add(e);
            this.timestamp.increase(this.pid);
        };
        this.lookup = (e) => this.A.lookup(e) && !this.R.lookup(e);
        this.compare = (tps) => this.A.compare(tps.A) || this.R.compare(tps.R);
        this.merge = (tps) => {
            const rs = new TwoPhase_Set(this.timestamp.length, this.pid); // the resulting set to be returned
            rs.A = this.A.merge(tps.A);
            rs.R = this.R.merge(tps.R);
            rs.pid = this.pid;
            rs.timestamp = this.timestamp.merge(tps.timestamp);
            rs.timestamp.increase(this.pid);
            return rs;
        };
        // gives the payload of this replica
        this.payload = () => {
            const ASet = this.A.payload()[0].split(',');
            const RSet = this.R.payload()[0].split(',');
            return [
                ASet.filter((e) => !RSet.includes(e)).toString(),
                this.getTimestamp(),
            ];
        };
        this.getTimestamp = () => this.timestamp.getVector();
        this.visualize = () => { };
        this.A = new GrowOnly_Set(maxProcesses, pid);
        this.R = new GrowOnly_Set(maxProcesses, pid);
        this.pid = pid;
        this.timestamp = new VectorClock(maxProcesses);
    }
}
