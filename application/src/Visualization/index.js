import React, { useState, useContext } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import General from './general';
import Specific from './specific';

// This component is responsible for the visualization of the states of the CRDTs

const Index = () => {
  // define dimensions for the visualization frame
  const dimensions = {
    width: '50vw',
    height: '70vh',
    margin: { top: 50, right: 20, bottom: 20, left: 20 },
  };

  const { proxies } = useContext(ProxyContext);

  const [show, setShow] = useState(false); // proxy we show in the specific visualization

  return (
    <div id="visualization" className="flexbox-container">
      <General dimensions={dimensions} proxies={proxies} />
      {show && <Specific dimensions={dimensions} proxy={show} />}
    </div>
  );
};

export default Index;
