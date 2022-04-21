import React, { useState, useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { ProxyContext } from '../Proxy/state-handling';
import Timeline from './timeline';
import Text from './text';
import BasicState from './basic-state';

const Index = ({ dimensions, svgRef }) => {
  const { proxies } = useContext(ProxyContext);

  console.log(proxies);

  // useEffect hook, the function defined within this hook is called each time the component is rendered again
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    console.log(svg);

    return () => {
      // svg.selectAll('text').data(Array.from(proxies)).exit().remove();
    };
  }, [proxies]); // Render the component if state changes

  return (
    <>
      <Text
        dimensions={{ ...dimensions, margin: { top: 55 } }}
        svgRef={svgRef}
        position={{ x: 50, y: 50 }}
      />
      <Timeline dimensions={dimensions} svgRef={svgRef} />
      <BasicState dimensions={dimensions} svgRef={svgRef} />
    </>
  );
};

export default Index;
