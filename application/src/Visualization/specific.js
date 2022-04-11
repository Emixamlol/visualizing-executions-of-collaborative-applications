import React, { useRef } from 'react';

// Specific visualization in more detail of one state the user clicked on

const Specific = ({ dimensions, proxy }) => {
  const {
    width,
    height,
    margin: { top, right, bottom, left },
  } = dimensions;
  const svgRef = useRef(null);
  return (
    <div className="visualization-element">
      <svg
        id="specific-visualization"
        svgRef={svgRef}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Specific;
