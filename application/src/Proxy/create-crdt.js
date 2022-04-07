import { Counter, Register, TPSet } from '../CRDTs';

/**
 * This file defines the api between proxies and CRDTs, such that the user can call generic functions on a proxy without worrying what CRDT it contains
 */

export const createCRDT = (crdt, params) => {
  console.log(`creating crdt ${crdt}`);
  switch (crdt) {
    case 'counter':
      return new Counter(parseInt(params[0], 10));

    case 'register':
      return new Register();

    case 'set':
      return new TPSet();

    default:
      throw new Error('this CRDT does not exist');
  }
};
