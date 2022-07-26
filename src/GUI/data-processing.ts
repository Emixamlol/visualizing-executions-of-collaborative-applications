import { Data } from '../types/d3-framework-types';
import { ID } from '../types/proxy-types';

/**
 * @param data  The information about every conceptual CRDT object with their respective replicas
 *
 * @returns The array containing the id of all the replicas of all the conceptual CRDT objects
 */
export const getAllReplicas = (data: Data): Array<{ id: ID }> => {
  return data.map(([, replicas]) => replicas.map(({ id }) => ({ id }))).flat();
};
