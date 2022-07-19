// process the entire data into different sets of data needed for the d3 api

import { Data, ProcessedData } from '../../types/d3-framework-types';
import { ID, Message, StateInterface } from '../../types/proxy-types';

export const processData = <T extends keyof ProcessedData>(
  data: Data,
  key: T
): ProcessedData[T] => {
  switch (key) {
    case 'objects':
      return data.map(([id, replicas]) => id) as ProcessedData[T];

    case 'replicas':
      break;

    default:
      const assertUnreachable = (x: never): never => {
        throw new Error("Didn't expect to get here");
      };
      assertUnreachable(key);
  }
};
