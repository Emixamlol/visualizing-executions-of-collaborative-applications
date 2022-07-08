import TwoPhase_Set from '../CRDTs/2P-Set/set';
import LWW_Register from '../CRDTs/LWW-Register/register';
import PN_Counter from '../CRDTs/PN-Counter/counter';

export type crdt = PN_Counter | LWW_Register | TwoPhase_Set;

export type payload = [string, number[]];

export enum CRDT {
  counter = 'counter',
  register = 'register',
  set = 'set',
}

export interface CRDTInterface<C> {
  type: CRDT; // each CRDT knows its type

  merge: (crdt: C) => C;

  payload: () => payload; // payload returns array with a string (actual payload) and timestamp

  getTimestamp: () => number[];
}
