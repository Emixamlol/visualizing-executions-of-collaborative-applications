export type payload = [string, number[]];

export enum CRDTtype {
  counter = 'counter',
  register = 'register',
  set = 'set',
}

export type CRDTmethodType = 'query' | 'update' | 'merge' | 'specific';

export interface CRDTInterface {
  type: CRDTtype; // each CRDT knows its type

  merge(crdt: CRDTInterface): CRDTInterface;

  payload(): payload; // payload returns array with a string (actual payload) and timestamp

  getTimestamp(): Array<number>;
}
