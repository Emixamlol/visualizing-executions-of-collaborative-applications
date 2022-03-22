import React from 'react';
import General from './general';
import Specific from './specific';

// This component is responsible for the visualization of the states of the CRDTs

const Index = () => {
  return (
    <div id="visualization" className="flexbox-container">
      <General />
      <Specific />
    </div>
  );
};

export default Index;
