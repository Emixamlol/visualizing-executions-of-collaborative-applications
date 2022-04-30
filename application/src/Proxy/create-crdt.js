import { Counter, Register, TPSet } from '../CRDTs';

/**
 * This file defines the api between proxies and CRDTs, such that the user can call generic functions on a proxy without worrying what CRDT it contains
 */

export const createCRDT = (crdt, params) => {
  switch (crdt) {
    case 'counter': {
      const [n, pid] = params.map((value) => parseInt(value, 10));
      return new Counter(n, pid);
    }

    case 'register': {
      const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
      return new Register(maxProcesses, pid);
    }

    case 'set': {
      const [maxProcesses, pid] = params.map((value) => parseInt(value, 10));
      return new TPSet(maxProcesses, pid);
    }

    default:
      throw new Error('this CRDT does not exist');
  }
};
