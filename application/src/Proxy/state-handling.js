import React, { useState, useEffect } from 'react';
import Visualization from '../Visualization';
import REPL from '../REPL';
import CrdtProxy from './crdt-proxy';

// create a Proxy context so that the REPL and Visualization components, together with all their child components, all have access to the proxies
export const ProxyContext = React.createContext();

const StateHandling = () => {
  const [proxies, setProxies] = useState(new Map()); // TODO : refactor to map of [id -> [originalProxy, Map of replicas]]

  const addProxy = (id, crdt, params) => {
    if (!proxies.has(id)) {
      const proxy = new CrdtProxy(id, crdt, [...params, 0]); // by adding a new crdt instance its pid is 0
      setProxies((proxies) => {
        return new Map(proxies).set(id, [proxy, new Map()]); // id maps to the original proxy and a map of all its replicas
      });
    }
  };

  const removeProxy = (id, replicas) => {
    console.log(replicas);
    if (!replicas.length) {
      // we want to delete all the replicas (including the original one)
      setProxies((proxies) => {
        const [original, replicas] = proxies.get(id);
        original.remove();
        replicas.forEach((replica) => replica.remove());
        proxies.delete(id);
        return new Map(proxies);
      });
    } else {
      // we only want to delete the specified replicas
      const [original, reps] = proxies.get(id);
      replicas.forEach((replica) => {
        reps.get(replica).remove();
        reps.delete(replica);
      });
      setProxies((proxies) => {
        return new Map(proxies).set(id, [original, reps]);
      });
    }
  };

  const replicateProxy = (idToReplicate, name) => {
    if (
      proxies.has(idToReplicate) &&
      !proxies.get(idToReplicate)[1].has(name)
    ) {
      const [original, replicas] = proxies.get(idToReplicate); // get the original proxy we want to replicate and the map of its current replicas
      const pid = replicas.size + 1;
      const newProxy = original.replicate(name, pid);
      if (newProxy) {
        setProxies((proxies) => {
          return new Map(proxies).set(idToReplicate, [
            original,
            new Map(replicas).set(name, newProxy),
          ]);
        });
      }
    }
  };

  const mergeProxy = (object, id, other_id) => {
    // get the map of object's replicas
    const [original, replicas] = proxies.get(object);
    const [p1, p2] = [replicas.get(id), replicas.get(other_id)];
    const merged = p1.merge(p2);
    if (merged) {
      proxies.set(object, [original, new Map(replicas).set(id, p1.merge(p2))]);
      removeProxy(other_id);
    }
  };

  const applyToProxy = (id, fn, params) => {
    const proxy = proxies.get(id);
    proxy.apply(fn, params);
    setProxies((proxies) => {
      return new Map(proxies).set(id, proxy);
    });
  };

  useEffect(() => {
    console.log(proxies);
    console.log(proxies.entries());
  }, [proxies]);

  // Wrap the application in the ProxyContext.Provider so that any component can have access to the properties from 'value' by using ProxyContext
  return (
    <ProxyContext.Provider
      value={{
        addProxy,
        removeProxy,
        replicateProxy,
        mergeProxy,
        applyToProxy,
        proxies,
      }}
    >
      <div className="grid-container">
        <Visualization />
        <REPL />
      </div>
    </ProxyContext.Provider>
  );
};

export default StateHandling;
