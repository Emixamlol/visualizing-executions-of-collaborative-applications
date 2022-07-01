"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VectorClock {
    constructor(n) {
        this.vector = [];
        this.length = 0;
        this.increase = (pid) => {
            this.vector[pid]++;
        };
        this.merge = (vc) => {
            const rvc = new VectorClock(this.length); // result vector clock
            for (let i = 0; i < this.length; i++) {
                rvc.vector[i] = Math.max(this.vector[i], vc.vector[i]);
            }
            return rvc;
        };
        this.isEqual = (vc) => {
            for (let i = 0; i < this.length; i++) {
                if (this.vector[i] !== vc.vector[i])
                    return false;
            }
            return true;
        };
        this.lessOrEqual = (vc) => {
            for (let i = 0; i < this.length; i++) {
                if (this.vector[i] > vc.vector[i])
                    return false;
            }
            return true;
        };
        this.less = (vc) => {
            for (let i = 0; i < this.length; i++) {
                if (this.vector[i] > vc.vector[i] || this.vector[i] === vc.vector[i])
                    return false;
            }
            return true;
        };
        this.getVector = () => this.vector.slice();
        this.length = n;
        this.vector = new Array(n).fill(0);
    }
}
exports.default = VectorClock;
