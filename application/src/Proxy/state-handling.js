import React, { useState, useEffect } from 'react';
import Visualization from '../Visualization';
import REPL from '../REPL';
import CrdtProxy from './crdt-proxy';

// create a Proxy context so that the REPL and Visualization components, together with all their child components, all have access to the proxies
export const ProxyContext = React.createContext();

const StateHandling = () => {
  const [proxies, setProxies] = useState(new Map());

  const addProxy = (id, crdt, params) => {
    if (!proxies.has(id)) {
      const proxy = new CrdtProxy(id, crdt, params);
      setProxies((proxies) => {
        return new Map(proxies).set(id, proxy);
      });
    }
  };

  const removeProxy = (id) => {
    setProxies((proxies) => {
      proxies.delete(id);
      return new Map(proxies);
    });
  };

  const mergeProxy = (id, other_id) => {
    const [p1, p2] = [proxies.get(id), proxies.get(other_id)];
    proxies.set(id, p1.merge(p2));
    removeProxy(other_id);
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
  }, [proxies]);

  // Wrap the application in the ProxyContext.Provider so that any component can have access to the properties from 'value' by using ProxyContext
  return (
    <ProxyContext.Provider
      value={{ addProxy, removeProxy, mergeProxy, applyToProxy, proxies }}
    >
      <div className="grid-container">
        <Visualization />
        <REPL />
      </div>
    </ProxyContext.Provider>
  );
};

export default StateHandling;
