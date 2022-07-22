// process the entire data into different sets of data needed for the d3 api

import { Data, subData } from '../../types/d3-framework-types';
import { ID, Message, StateInterface } from '../../types/proxy-types';

export const processData = <T extends keyof subData>(
  data: Data,
  key: T
): subData[T] => {
  switch (key) {
    case 'objectIds':
      return data.map(([id]) => id) as subData[T];

    case 'replicas':
      return data.map(([, replicas]) => replicas) as unknown as subData[T];

    case 'replicaIds':
      return data
        .map(([, replicas]) => replicas.map(({ id }) => id))
        .flat() as subData[T];

    case 'states':
      return data
        .map(([, replicas]) => replicas.map(({ state }) => state))
        .flat() as subData[T];

    default:
      const assertUnreachable = (x: never): never => {
        throw new Error("Didn't expect to get here");
      };
      assertUnreachable(key);
  }
};
