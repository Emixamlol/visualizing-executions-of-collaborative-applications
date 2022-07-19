import CrdtProxy from './crdt-proxy';
/**
 * map of all proxies: maps the ID of a CRDT to the map of each replica, in which the ID points to the proxy containing said replica
 */
const proxies = new Map();
/**
 * map of CRDT replicas mapping to the name of the original replica
 */
const replicaNames = new Map();
/**
 * Adds a completely new CRDT instance (contained within a proxy) to the global map of proxies.
 * Every other replica of an already existing CRDT instance will be added with the replicateProxy method
 *
 * @param id        id of the original CRDT instance and id of the replica
 * @param crdt      CRDT type of the CRDT instance contained within the proxy
 * @param params    parameters necessary for the CRDT instantiation
 */
export const addProxy = (id, crdt, params) => {
    // don't add the proxy if there aleady exists one with this id
    if (!proxies.has(id)) {
        const proxy = new CrdtProxy(id, crdt, [...params, '0']);
        proxies.set(id, new Map([[id, proxy]]));
        replicaNames.set(id, id);
    }
    console.log(proxies);
};
export const removeProxy = (id) => {
    proxies.delete(id);
};
export const queryProxy = (id, params) => {
    const originalId = replicaNames.get(id);
    const replicas = proxies.get(originalId);
    const proxy = replicas.get(id);
    console.log(proxy.query(params));
    console.log(proxies);
};
/**
 * Replicates a proxy, which creates a new proxy with the contained CRDT object being a replica of the replicated proxy's CRDT object
 *
 * @param idToReplicate id of the original CRDT instance being replicated
 * @param replicaId     id of the replicated CRDT object
 */
export const replicateProxy = (idToReplicate, replicaId) => {
    const replicas = proxies.get(idToReplicate);
    if (proxies.has(idToReplicate) &&
        !proxies.has(replicaId) &&
        !replicas.has(replicaId)) {
        const originalProxy = replicas.get(idToReplicate);
        const pid = replicas.size;
        const replica = originalProxy.replicate(replicaId, pid);
        if (replica) {
            replicaNames.set(replicaId, idToReplicate); // map the id of the replica to the id of the original replica it was replicated from
            proxies.set(idToReplicate, replicas.set(replicaId, replica)); // save the replica in proxies
        }
    }
    console.log(proxies);
};
/**
 * Merges the CRDT replica of the first proxy with the one of the second proxy. The merged replica is stored in the first proxy, the second proxy's replica
 * is left untouched
 *
 * @param id    id of the first proxy, containing the CRDT replica which will be replaced with the result from the merge
 * @param other id of the second proxy, containing the CRDT replica which will NOT be replaced
 */
export const mergeProxy = (id, other) => {
    const originalId = replicaNames.get(id);
    const replicas = proxies.get(originalId);
    const [p1, p2] = [
        replicas.get(id),
        replicas.get(other),
    ];
    p1.merge(p2);
    console.log(proxies);
};
/**
 * Applies a method to a CRDT replica contained within one of the proxies
 *
 * @param id        id of the CRDT replica
 * @param fn        name of the method to be applied
 * @param params    parameters the method takes
 */
export const applyToProxy = (id, fn, params) => {
    const originalId = replicaNames.get(id); // get the id of the original CRDT instance the proxy is a replica from
    console.log(originalId);
    const replicas = proxies.get(originalId);
    const proxy = replicas.get(id);
    proxy.apply(fn, params);
};