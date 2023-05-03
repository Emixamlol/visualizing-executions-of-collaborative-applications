var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CrdtProxy from './crdt-proxy';
import { CRDTtype } from '../types/crdt-types';
import * as framework from '../D3-framework';
import * as gui from '../GUI';
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
/**
 * Sends the proxies information to the d3 framework (in the correct Data format)
 */
const sendToFramework = () => {
    const data = convertToData();
    // console.log(data);
    framework.update(data);
};
/**
 * Sends the proxies information to the GUI
 */
const sendToGui = () => {
    const data = convertToData();
    // console.log(data);
    gui.update(data);
};
/**
 * Get the ID of the conceptual object represented by a replica
 */
export const getObjectId = (id) => conceptualCRDTNames.get(id).id;
/**
 * Get the CRDT type of a CRDT replica
 */
export const getType = (id) => conceptualCRDTNames.get(id).type;
/**
 * Adds a completely new CRDT object (contained within a proxy) to the global map of proxies.
 * Every other replica of an already existing CRDT instance will be added with the replicateProxy method
 *
 * @param id        id of the original, conceptual CRDT object and id of the replica
 * @param crdt      CRDT type of the CRDT object contained within the proxy
 * @param params    parameters necessary for the CRDT instantiation
 */
export const addProxy = (id, crdt, params) => {
    // don't add the proxy if there aleady exists one with this id
    if (!proxies.has(id)) {
        const proxy = new CrdtProxy(id, crdt, [...params, '0']);
        proxies.set(id, new Map([[id, proxy]]));
        const type = proxy.getType();
        conceptualCRDTNames.set(id, { id, type });
    }
    // console.log(proxies);
    sendToFramework();
    sendToGui();
};
export const removeProxy = (id) => {
    proxies.delete(id);
    sendToFramework();
    sendToGui();
};
export const queryProxy = (id, params) => {
    const { id: conceptualId } = conceptualCRDTNames.get(id);
    const replicas = proxies.get(conceptualId);
    const proxy = replicas.get(id);
    proxy.query(params);
};
/**
 * Replicates a proxy, which creates a new proxy with the contained CRDT object being a replica of the replicated proxy's CRDT object
 *
 * @param idToReplicate id of the original CRDT instance being replicated
 * @param replicaId     id of the replicated CRDT object
 */
export const replicateProxy = (idToReplicate, replicaId) => {
    let replicaIdAvailable = true;
    checkAvailability: for (const replicas of proxies.values()) {
        if (replicas.has(replicaId)) {
            replicaIdAvailable = false;
            break checkAvailability;
        }
    }
    if (proxies.has(idToReplicate) &&
        !proxies.has(replicaId) &&
        replicaIdAvailable) {
        const replicas = proxies.get(idToReplicate);
        const originalProxy = replicas.get(idToReplicate);
        const pid = replicas.size;
        const replica = originalProxy.replicate(replicaId, pid);
        if (replica) {
            // map the id of the replica to the id of the original replica it was replicated from
            conceptualCRDTNames.set(replicaId, {
                id: idToReplicate,
                type: replica.getType(),
            });
            proxies.set(idToReplicate, replicas.set(replicaId, replica)); // save the replica in proxies
        }
    }
    // console.log(proxies);
    sendToFramework();
    sendToGui();
};
/**
 * Merges the CRDT replica of the first proxy with the one of the second proxy. The merged replica is stored in the first proxy, the second proxy's replica
 * is left untouched
 *
 * @param id    id of the first proxy, containing the CRDT replica which will be replaced with the result from the merge
 * @param other id of the second proxy, containing the CRDT replica which will NOT be replaced
 */
export const mergeProxy = (id, other) => {
    const { id: conceptualId } = conceptualCRDTNames.get(id);
    const replicas = proxies.get(conceptualId);
    const [p1, p2] = [
        replicas.get(id),
        replicas.get(other),
    ];
    p1.merge(p2);
    // console.log(proxies);
    sendToFramework();
};
/**
 * Applies a method to a CRDT replica contained within one of the proxies
 *
 * @param id        id of the CRDT replica
 * @param fn        name of the method to be applied
 * @param params    parameters the method takes
 */
export const applyToProxy = (id, fn, params) => {
    const { id: conceptualId } = conceptualCRDTNames.get(id); // get the id of the conceptual CRDT object the proxy is a replica from
    const replicas = proxies.get(conceptualId);
    const proxy = replicas.get(id);
    proxy.apply(fn, params);
    sendToFramework();
    sendToGui();
};
/**
 * Visualizes the more detailed information of a CRDT replica
 *
 * @param id  id of the CRDT replica
 */
export const visualizeCRDT = (id) => {
    const { id: conceptualId } = conceptualCRDTNames.get(id); // get the id of the conceptual CRDT object the proxy is a replica from
    const replicas = proxies.get(conceptualId);
    const proxy = replicas.get(id);
    proxy.visualize();
};
// -------------------------- TEST CODE --------------------------
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const demo = () => __awaiter(void 0, void 0, void 0, function* () {
    addProxy('p', CRDTtype.counter, ['5', '0']);
    yield delay(1000);
    replicateProxy('p', 'p2');
    yield delay(1000);
    addProxy('x', CRDTtype.register, ['4', '0']);
    yield delay(1000);
    applyToProxy('p', 'increment', []);
    yield delay(1000);
    mergeProxy('p2', 'p');
});
demo();
/* const firstElement = <Type>(arr: Type[]): Type | undefined => {
  return arr[0];
};

console.log('object keys');

console.log(Object.values(firstElement));

const c = new PN_Counter(5, 0);

console.log(Object.entries(Object.getOwnPropertyDescriptors(c)));
console.log(Object.entries(Object.getOwnPropertyDescriptor(c, 'compare')));

console.log(Object.getOwnPropertyDescriptors(c).compare.value.length);

console.log(Object.getOwnPropertyNames(c));

const rc = new RevisitedCounter(5, 0);

console.log(Object.entries(Object.getOwnPropertyDescriptors(rc)));
console.log(Object.entries(Object.getOwnPropertyDescriptor(rc, 'compare')));

console.log(
  Object.getOwnPropertyDescriptors(rc)['update']['value']['increment']
);
console.log(Object.entries(Object.getOwnPropertyDescriptors(rc).update.value));

console.log(Object.getOwnPropertyNames(rc));

console.log('rc2');

const rc2 = revisitedCreateCRDT(CRDTtype.counter, ['5', '1']);
console.log(
  Object.entries(Object.getOwnPropertyDescriptors(rc2).update.value).map(
    ([name, fn]) => (fn as any).length
  )
); */
