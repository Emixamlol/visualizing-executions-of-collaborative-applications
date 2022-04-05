import React, { useState } from 'react';
import Visualization from '../Visualization';
import REPL from '../REPL';
import CrdtProxy from './crdt-proxy';

// create a Proxy context so that the REPL and Visualization components, together with all their child components, all have access to the proxies
export const ProxyContext = React.createContext();

const StateHandling = () => {
  const [proxies, setProxies] = useState([]);

  const addProxy = ({ id, crdt, params }) => {
    if (!proxies.find((el) => el.id === id)) {
      const proxy = new CrdtProxy(id, crdt, params);
      setProxies((proxies) => {
        return [...proxies, proxy];
      });
    }
  };

  const removeProxy = (id) => {
    setProxies((proxies) => {
      return proxies.filter((proxy) => proxy.id !== id);
    });
  };

  const applyProxy = (id, fn, params) => {
    const proxy = proxies.find((el) => (el.id = id));
    proxy.apply(id, fn, params);
  };

  console.log(proxies);

  // Wrap the application in the ProxyContext.Provider so that any component can have access to the properties from 'value' by using ProxyContext
  return (
    <ProxyContext.Provider
      value={{ addProxy, removeProxy, applyProxy, proxies }}
    >
      <div className="grid-container">
        <Visualization />
        <REPL />
      </div>
    </ProxyContext.Provider>
  );
};

export default StateHandling;
