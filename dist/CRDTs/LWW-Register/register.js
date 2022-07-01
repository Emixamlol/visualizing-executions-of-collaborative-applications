"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_clock_1 = require("../vector-clock");
class LWW_Register {
    constructor(maxProcesses, pid) {
        this.assign = (w) => {
            this.X = w;
            this.timestamp.increase(this.pid);
        };
        this.value = () => this.X;
        this.compare = (lwwr) => this.timestamp.lessOrEqual(lwwr.timestamp);
        this.merge = (lwwr) => {
            const rr = new LWW_Register(this.timestamp.length, this.pid);
            if (this.compare(lwwr)) {
                rr.X = lwwr.X;
                rr.timestamp = lwwr.timestamp;
            }
            else {
                rr.X = this.X;
                rr.timestamp = this.timestamp;
            }
            rr.pid = this.pid;
            rr.timestamp = this.timestamp.merge(lwwr.timestamp);
            return rr;
        };
        this.payload = () => [this.X, this.getTimestamp()];
        this.getTimestamp = () => this.timestamp.getVector();
        this.X = undefined;
        this.pid = pid;
        this.timestamp = new vector_clock_1.default(maxProcesses);
    }
}
exports.default = LWW_Register;
