import React, { useState, useEffect } from 'react';
import Proxy from './Proxy';
import { ProxyContext } from './Proxy/proxy-context';
import Visualization from './Visualization';
import REPL from './REPL';

const App = () => {
  // create a Proxy context so that the REPL and Visualization components, together with all their child components, all have access to the proxies

  const [proxies, setProxies] = useState([]);

  const removeProxy = (id) => {
    setProxies((proxies) => {
      return proxies.filter((proxy) => proxy.id !== id);
    });
  };

  const addProxy = (proxy) => {
    if (!proxies.find((el) => el.id === proxy.id))
      setProxies((proxies) => {
        return [...proxies, proxy];
      });
  };

  console.log(proxies);

  useEffect(() => {
    console.log('App useEffect called');
  });

  // Wrap the application in the ProxyContext.Provider so that any component can have access to the properties from 'value' by using ProxyContext
  return (
    <ProxyContext.Provider value={{ removeProxy, addProxy }}>
      <div className="grid-container">
        <Visualization />
        <REPL />
        {proxies.map((proxy) => {
          return <Proxy key={proxy.id} {...proxy} />;
        })}
      </div>
    </ProxyContext.Provider>
  );
};

export default App;
