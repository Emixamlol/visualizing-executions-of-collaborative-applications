import React from 'react';
import Demo from '../CRDTs/LWW-Register/demo';

// General visualisation of the states of the CRDTs

const General = () => {
  return (
    <div className="visualization-element">
      <h2>Visualization</h2>
      {/* General */}
      <Demo />
    </div>
  );
};

export default General;
