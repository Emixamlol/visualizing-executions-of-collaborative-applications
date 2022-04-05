import React, { useState, useEffect } from 'react';
import ProxyStateHandling from './Proxy/state-handling';
import { Counter, Register, TPSet } from './CRDTs';
import { crdt_handler } from './Proxy/crdt-handler';
import Visualization from './Visualization';
import REPL from './REPL';

const App = () => {
  useEffect(() => {
    console.log('App useEffect called');
  });

  return <ProxyStateHandling />;
};

export default App;
