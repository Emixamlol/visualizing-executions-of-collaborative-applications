import { CRDTtype, } from '../types/crdt-types';
import { PN_Counter, LWW_Register, TwoPhase_Set, LWW_Flag, Inc_Counter, GrowOnly_Set, } from './index';
import RevisitedCounter from './PN-Counter/revisited-counter';
// method to instantiate a CRDT
export const createCRDT = (crdt, params) => {
    switch (crdt) {
        case CRDTtype.flag: {
            const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
            return new LWW_Flag(maxProcesses, pid);
        }
        case CRDTtype.inc_counter: {
            const [n, pid] = params.map((value) => parseInt(value, 10));
            return new Inc_Counter(n, pid);
        }
        case CRDTtype.grow_set: {
            const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
            return new GrowOnly_Set(maxProcesses, pid);
        }
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
// revisited
export const revisitedCreateCRDT = (type, params) => {
    switch (type) {
        case CRDTtype.flag: {
        }
        case CRDTtype.inc_counter: {
        }
        case CRDTtype.grow_set: {
        }
        case CRDTtype.counter:
            const [n, pid] = params.map((value) => parseInt(value, 10));
            return new RevisitedCounter(n, pid);
        case CRDTtype.register:
            throw Error('revisited register not implemented');
        case CRDTtype.set:
            throw Error('revisited set not implemented');
        default:
            const assertUnreachable = (x) => {
                throw new Error('CRDT type does not exist');
            };
            assertUnreachable(type);
    }
};
