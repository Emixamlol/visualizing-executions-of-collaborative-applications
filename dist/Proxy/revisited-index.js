/**
 * map of all proxies: maps the ID of a CRDT to the map of each replica, in which the ID points to the proxy containing said replica
 */
const proxies = new Map();
/**
 * map of CRDT replicas mapping to the name of the conceptual CRDT object they represent, as well as its CRDT type
 */
const conceptualCRDTNames = new Map();
/**
 * Converts the information in the proxies map to data required by the d3 framework and the gui
 */
const convertToData = () => Array.from(proxies).map(([objectId, replicas]) => [
    objectId,
    Array.from(replicas).map(([replicaId, proxy]) => ({
        id: replicaId,
        state: proxy.getState(),
    })),
]);
export {};
