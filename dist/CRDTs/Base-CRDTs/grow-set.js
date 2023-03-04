import { drawSet } from '../../D3-framework';
import { CRDTtype } from '../../types/crdt-types';
import VectorClock from '../vector-clock';
export default class GrowOnly_Set {
    constructor(maxProcesses, pid) {
        this.type = CRDTtype.grow_set;
        this.add = (e) => {
            this.A.add(e);
            this.timestamp.increase(this.pid);
        };
        this.lookup = (e) => this.A.has(e);
        this.subset = (A, B) => {
            if (A.size <= B.size) {
                A.forEach((e) => {
                    if (!B.has(e))
                        return false;
                });
                return true;
            }
            return false;
        };
        this.compare = (gos) => this.subset(this.A, gos.A);
        this.union = (A, B) => {
            if (A.size <= B.size) {
                A.forEach((e) => {
                    B.add(e);
                });
                return B;
            }
            else {
                B.forEach((e) => {
                    A.add(e);
                });
                return A;
            }
        };
        this.merge = (gos) => {
            const rs = new GrowOnly_Set(this.timestamp.length, this.pid); // the resulting set to be returned
            rs.A = this.union(new Set(this.A), new Set(gos.A));
            rs.pid = this.pid;
            rs.timestamp = this.timestamp.merge(gos.timestamp);
            rs.timestamp.increase(this.pid);
            return rs;
        };
        this.payload = () => {
            const result = new Set(Array.from(this.A));
            return [Array.from(result).toString(), this.getTimestamp()];
        };
        this.getTimestamp = () => this.timestamp.getVector();
        this.visualize = () => {
            console.log('visualizing grow_set');
            console.log(Array.from(this.A));
            drawSet(Array.from(this.A));
        };
        this.A = new Set([]);
        this.pid = pid;
        this.timestamp = new VectorClock(maxProcesses);
    }
}
