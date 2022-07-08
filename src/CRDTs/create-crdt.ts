import { crdt, CRDT } from '../types/crdt-types';
import { PN_Counter, LWW_Register, TwoPhase_Set } from './index';

/**
 * This file defines the api between proxies and CRDTs, such that the user can call generic functions on a proxy without worrying what CRDT it contains
 */

export const createCRDT = (crdt: CRDT, params: string[]): crdt => {
  switch (crdt) {
    case CRDT.counter: {
      const [n, pid] = params.map((value) => parseInt(value, 10));
      return new PN_Counter(n, pid);
    }

    case CRDT.register: {
      const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
      return new LWW_Register(maxProcesses, pid);
    }

    case CRDT.set: {
      const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
      return new TwoPhase_Set(maxProcesses, pid);
    }

    default:
      throw new Error('this CRDT does not exist');
  }
};
