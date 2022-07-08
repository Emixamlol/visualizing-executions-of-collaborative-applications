import TwoPhase_Set from '../CRDTs/2P-Set/set';
import LWW_Register from '../CRDTs/LWW-Register/register';
import PN_Counter from '../CRDTs/PN-Counter/counter';

export type crdt = PN_Counter | LWW_Register | TwoPhase_Set;

export enum CRDT {
  counter = 'counter',
  register = 'register',
  set = 'set',
}

export interface CRDTInterface<C> {
  merge: (crdt: C) => C;

  payload: () => [string, number[]]; // payload returns array with a string (actual payload) and timestamp

  getTimestamp: () => number[];
}
