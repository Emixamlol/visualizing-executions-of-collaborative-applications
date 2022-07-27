import { CRDTtype } from '../types/crdt-types';
/**
 * @param data  The information about every conceptual CRDT object with their respective replicas
 *
 * @returns The array containing the id of all the replicas of all the conceptual CRDT objects
 */
export const getAllReplicas = (data) => data.map(([, replicas]) => replicas.map(({ id }) => ({ id }))).flat();
/**
 * Get all the replicas representing the same conceptual CRDT object: these are the replicas that can be merged with.
 *
 * @param data  The information about every conceptual CRDT object with their respective replicas
 * @param id    The id of the replica of the conceptual CRDT object who's other replicas we are getting
 */
export const getSiblingReplicas = (data, id) => data
    .filter(([, replicas]) => !replicas.every((d) => d.id !== id))
    .map(([, replicas]) => replicas)
    .flat()
    .filter((d) => d.id !== id)
    .map(({ id }) => ({ id }));
/**
 * Get the possible update methods according to the CRDT type
 *
 * @param type  The CRDT tyoe
 */
export const getMethods = (type) => {
    switch (type) {
        case CRDTtype.counter:
            return [
                { fn: 'increment', args: false },
                { fn: 'decrement', args: false },
            ];
        case CRDTtype.register:
            return [{ fn: 'assign', args: true }];
        case CRDTtype.set:
            return [
                { fn: 'add', args: true },
                { fn: 'remove', args: true },
            ];
        default:
            const assertUnreachable = (x) => {
                throw new Error('CRDT type does not exist');
            };
            assertUnreachable(type);
    }
};
