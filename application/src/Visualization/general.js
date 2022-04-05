import React, { useContext } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import Proxy from '../Proxy';
import Demo from '../CRDTs/LWW-Register/demo';

// General visualisation of the states of the CRDTs

const General = () => {
  const { proxies } = useContext(ProxyContext);

  return (
    <div className="visualization-element">
      <h2>Visualization</h2>
      {proxies.map((proxy) => {
        return <Proxy key={proxy.id} {...proxy} />;
      })}
      {/* <Demo /> */}
    </div>
  );
};

export default General;
