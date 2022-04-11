import React, { useState, useRef, useContext } from 'react';
import Framework from '../D3-framework';
import Demo from '../CRDTs/LWW-Register/demo';

// General visualisation of the states of the CRDTs

const General = ({ dimensions, proxies }) => {
  const {
    width,
    height,
    margin: { top, right, bottom, left },
  } = dimensions;
  const svgRef = useRef(null);

  return (
    <div className="visualization-element">
      {/* <h2>Visualization</h2> */}
      <svg
        id="general-visualization"
        ref={svgRef}
        width={width}
        height={height}
      />
      <Framework proxies={proxies} dimensions={dimensions} svgRef={svgRef} />
      {/* {Array.from(proxies).map(([id, proxy]) => {
        return (
          <Framework
            key={id}
            proxy={proxy}
            dimensions={dimensions}
            svgRef={svgRef}
          />
        );
      })} */}
      {/* <Demo /> */}
    </div>
  );
};

export default General;
