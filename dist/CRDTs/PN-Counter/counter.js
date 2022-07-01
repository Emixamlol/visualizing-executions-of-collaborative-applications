"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_clock_1 = require("../vector-clock");
class PN_Counter {
    constructor(n, pid) {
        this.increment = () => {
            this.P[this.pid]++;
            this.timestamp.increase(this.pid);
        };
        this.decrement = () => {
            this.N[this.pid]++;
            this.timestamp.increase(this.pid);
        };
        this.value = () => {
            let incSum = 0;
            let decSum = 0;
            for (let i = 0; i < this.P.length; i++) {
                incSum += this.P[i];
                decSum += this.N[i];
            }
            return incSum - decSum;
        };
        this.compare = (pnc) => {
            for (let i = 0; i < this.P.length; i++) {
                if (this.P[i] > pnc.P[i] || this.N[i] > pnc.N[i])
                    return false;
            }
            return true;
        };
        this.merge = (pnc) => {
            const n = this.P.length;
            const rc = new PN_Counter(n, this.pid);
            for (let i = 0; i < n; i++) {
                rc.P[i] = Math.max(this.P[i], pnc.P[i]);
                rc.N[i] = Math.max(this.N[i], pnc.N[i]);
            }
            rc.timestamp = this.timestamp.merge(pnc.timestamp);
            console.log(rc);
            return rc;
        };
        this.payload = () => [this.value(), this.getTimestamp()];
        this.getTimestamp = () => this.timestamp.getVector();
        this.specificState = () => [
            this.value(),
            this.P.slice(),
            this.N.slice(),
            this.pid,
            this.timestamp.getVector(),
        ];
        this.pid = pid;
        this.timestamp = new vector_clock_1.default(n);
        this.P = new Array(n).fill(0);
        this.N = new Array(n).fill(0);
    }
}
exports.default = PN_Counter;
