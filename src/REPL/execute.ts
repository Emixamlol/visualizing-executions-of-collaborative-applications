import { ParsedCode } from '../types/repl-types';
import { ID, ProxyMethod } from '../types/proxy-types';
import {
  addProxy,
  applyToProxy,
  mergeProxy,
  queryProxy,
  removeProxy,
  replicateProxy,
} from '../main';
import { CRDTtype } from '../types/crdt-types';

export const execute = ({ proc, parameters }: ParsedCode): void => {
  switch (proc) {
    case ProxyMethod.new: {
      // create a new proxy
      const [id, crdt, ...params] = parameters;
      addProxy(id, CRDTtype[crdt], params);
      break;
    }

    case ProxyMethod.query: {
      const [id, ...params] = parameters;
      queryProxy(id, params);
      break;
    }

    case ProxyMethod.delete: {
      // remove a proxy
      const [id] = parameters;
      removeProxy(id);
      break;
    }

    case ProxyMethod.replicate: {
      // replicate a proxy
      const [idToReplicate, replicaId] = parameters;
      replicateProxy(idToReplicate, replicaId);
      break;
    }

    case ProxyMethod.merge: {
      // merge two proxies
      const [id, other] = parameters;
      mergeProxy(id, other);
      break;
    }

    case ProxyMethod.apply: {
      // apply a proxy method to a proxy
      const [id, fn, ...params] = parameters;
      applyToProxy(id, fn, params);
      break;
    }

    default:
      throw new Error('cannot execute invalid code');
  }
};
