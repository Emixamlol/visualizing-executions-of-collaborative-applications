import React, { useRef } from 'react';
import Framework from '../D3-framework';
import Demo from '../CRDTs/LWW-Register/demo';

// General visualisation of the states of the CRDTs

const General = ({ dimensions }) => {
  const {
    width,
    height,
    margin: { top, right, bottom, left },
  } = dimensions;
  const svgRef = useRef(null);

  return (
    <div className="visualization-element">
      <svg
        id="general-visualization"
        ref={svgRef}
        width={width}
        height={height}
      />
      <Framework dimensions={dimensions} svgRef={svgRef} />
      {/* <Demo /> */}
    </div>
  );
};

export default General;
