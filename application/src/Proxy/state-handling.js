import React, { useState, useEffect } from 'react';
import Visualization from '../Visualization';
import REPL from '../REPL';
import CrdtProxy from './crdt-proxy';

// create a Proxy context so that the REPL and Visualization components, together with all their child components, all have access to the proxies
export const ProxyContext = React.createContext();

const StateHandling = () => {
  const [proxies, setProxies] = useState(new Map());
  const [originalCRDTs] = useState(new Map()); // maps replicas to the original crdt id they were replicated from

  const addProxy = (id, crdt, params) => {
    if (!proxies.has(id)) {
      const proxy = new CrdtProxy(id, crdt, [...params, 0]); // by adding a new crdt instance its pid is 0
      setProxies((proxies) => {
        return new Map(proxies).set(id, [proxy, new Map()]); // id maps to the original proxy and a map of all its replicas
      });
    }
  };

  const removeProxy = (id) => {
    const originalCrdtId = originalCRDTs.get(id); // get the id of crdt of which id is a replica
    const [original, replicas] = proxies.get(originalCrdtId);
    const proxy = replicas.get(id);
    // console.log(proxy);
    proxy.remove();
    setProxies((proxies) => {
      replicas.delete(id);
      originalCRDTs.delete(id);
      return new Map(proxies).set(originalCrdtId, [
        original,
        new Map(replicas),
      ]);
    });
  };

  const replicateProxy = (idToReplicate, replicaId) => {
    if (
      proxies.has(idToReplicate) &&
      !proxies.get(idToReplicate)[1].has(replicaId)
    ) {
      const [original, replicas] = proxies.get(idToReplicate); // get the original proxy we want to replicate and the map of its current replicas
      const pid = replicas.size + 1;
      const newProxy = original.replicate(replicaId, pid);
      if (newProxy) {
        originalCRDTs.set(replicaId, idToReplicate); // save the fact that replicaId was replicated from idToReplicate
        setProxies((proxies) => {
          return new Map(proxies).set(idToReplicate, [
            original,
            new Map(replicas).set(replicaId, newProxy),
          ]);
        });
      }
    }
  };

  const mergeProxy = (id, other_id) => {
    const originalCrdtId = originalCRDTs.get(id); // get the id of crdt of which id is a replica
    // console.log(originalCrdtId);
    // get the map of object's replicas
    const [original, replicas] = proxies.get(originalCrdtId);
    // console.log(original);
    // console.log(replicas);
    const [p1, p2] = [replicas.get(id), replicas.get(other_id)];
    console.log(p1);
    console.log(p2);
    const merged = p1.merge(p2);
    console.log(merged);
    if (merged) {
      setProxies((proxies) => {
        return new Map(proxies).set(originalCrdtId, [
          original,
          new Map(replicas).set(id, merged),
        ]);
      });
    }
  };

  const applyToProxy = (id, fn, params) => {
    const originalCrdtId = originalCRDTs.get(id); // get the id of crdt of which id is a replica
    const [original, replicas] = proxies.get(originalCrdtId);
    const proxy = replicas.get(id);
    console.log(proxy);
    proxy.apply(fn, params);
    setProxies((proxies) => {
      return new Map(proxies).set(originalCrdtId, [
        original,
        new Map(replicas).set(id, proxy),
      ]);
    });
  };

  useEffect(() => {
    // console.log(proxies);
    const replicas = (() => {
      let arr = [];
      for (const [id, [original, map]] of proxies.entries()) {
        arr = arr.concat(Array.from(map));
      }
      return arr;
    })();
    console.log(replicas);
    const originals = (() => {
      let arr = [];
      for (const [id, [original, map]] of proxies.entries()) {
        arr = arr.concat([[id].concat(Array.from(map.keys()))]);
      }
      return arr;
    })();
    console.log(originals);
    for (const [id, [original, map]] of proxies.entries()) {
      // console.log(`${id}'s state = ${JSON.stringify(original.getState())}`);
      for (const [id, proxy] of map.entries()) {
        console.log(`${id}'s state = ${JSON.stringify(proxy.getState())}`);
      }
    }
    const histories = (() => {
      let arr = [];
      for (const [id, [original, map]] of proxies.entries()) {
        for (const [replicaId, proxy] of map.entries()) {
          // console.log(proxy.getState().history);
          arr = arr.concat([proxy.getState().history]);
        }
      }
      return arr;
    })();
    console.log(histories);
    console.log(proxies);
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
