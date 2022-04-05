import { Counter, Register, TPSet } from '../CRDTs';

// this file defines the function which instantiates new CRDT objects

export const createCRDT = (crdt, params) => {
  console.log(crdt);
  switch (crdt) {
    case 'counter':
      return new Counter(params[0]);

    case 'register':
      return new Register();

    case 'set':
      return new TPSet();

    default:
      throw new Error('this CRDT does not exist');
  }
};
