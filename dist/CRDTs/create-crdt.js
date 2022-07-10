import { CRDTtype } from '../types/crdt-types';
import { PN_Counter, LWW_Register, TwoPhase_Set } from './index';
// method to instantiate a CRDT
export const createCRDT = (crdt, params) => {
    switch (crdt) {
        case CRDTtype.counter: {
            const [n, pid] = params.map((value) => parseInt(value, 10));
            return new PN_Counter(n, pid);
        }
        case CRDTtype.register: {
            const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
            return new LWW_Register(maxProcesses, pid);
        }
        case CRDTtype.set: {
            const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
            return new TwoPhase_Set(maxProcesses, pid);
        }
        default:
            throw new Error('this CRDT does not exist');
    }
};
