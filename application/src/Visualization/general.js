import React, { useContext } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import Framework from '../D3-framework';
import Demo from '../CRDTs/LWW-Register/demo';

// General visualisation of the states of the CRDTs

const General = () => {
  const { proxies } = useContext(ProxyContext);

  return (
    <div className="visualization-element">
      <h2>Visualization</h2>
      {Array.from(proxies).map(([id, proxy]) => {
        return <Framework key={id} proxy={proxy} />;
      })}
      {/* <Demo /> */}
    </div>
  );
};

export default General;
