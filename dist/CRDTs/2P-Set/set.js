"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_clock_1 = require("../vector-clock");
class TwoPhase_Set {
    constructor(maxProcesses, pid) {
        this.add = (e) => {
            this.A.add(e);
            this.timestamp.increase(this.pid);
        };
        this.remove = (e) => {
            if (this.lookup(e))
                this.R.add(e);
            this.timestamp.increase(this.pid);
        };
        this.lookup = (e) => this.A.has(e) && !this.R.has(e);
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
        this.compare = (tps) => this.subset(this.A, tps.A) || this.subset(this.R, tps.R);
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
        this.merge = (tps) => {
            const rs = new TwoPhase_Set(this.timestamp.length, this.pid); // the resulting set to be returned
            rs.A = this.union(this.A, tps.A);
            rs.R = this.union(this.R, tps.R);
            rs.pid = this.pid;
            rs.timestamp = this.timestamp.merge(tps.timestamp);
            return rs;
        };
        // gives the payload of this replia
        this.payload = () => {
            const result = new Set(Array.from(this.A));
            this.R.forEach((e) => result.delete(e));
            return [Array.from(result), this.getTimestamp()];
        };
        this.A = new Set([]);
        this.R = new Set([]);
        this.pid = pid;
        this.timestamp = new vector_clock_1.default(maxProcesses);
    }
}
exports.default = TwoPhase_Set;
