export interface CodeInterface {
  proc: string;
  parameters: string[];
}

export enum CRDTMethod {
  new = 'new',
  delete = 'delete',
  replicate = 'replicate',
  merge = 'merge',
  apply = 'apply',
}

export enum Keyword {
  const = 'const',
  delete = 'delete',
  replicate = 'replicate',
}

export interface CRDTInterface<C> {
  merge: (crdt: C) => C;

  payload: () => [string, number[]]; // payload returns array with a string (actual payload) and timestamp

  getTimestamp: () => number[];
}
