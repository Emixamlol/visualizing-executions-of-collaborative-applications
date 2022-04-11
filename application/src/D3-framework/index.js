import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Index = ({ proxies, dimensions, svgRef }) => {
  const {
    width,
    height,
    margin: { top, right, bottom, left },
  } = dimensions;

  // const [state, setState] = useState(proxy.getState());
  // console.log(state);

  console.log(proxies);
  const svg = d3.select(svgRef.current);
  const idDiv = svg.append('g');

  // useEffect hook, the function defined within this hook is called each time the component is rendered again
  useEffect(() => {
    // const svg = d3.select(svgRef.current);
    // const idDiv = svg.append('g');

    idDiv
      .selectAll('text')
      .data(Array.from(proxies))
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 20)
      .attr('y', 70)
      .attr('fill', 'black')
      .text(([id, proxy]) => id);

    // console.log(proxy);
    console.log(svg);

    console.log(idDiv);

    return () => {
      // idDiv.remove();
      idDiv.selectAll('text').data(Array.from(proxies)).exit().remove();
    };
  }, [proxies]); // Render the component if state changes

  return null;
};

export default Index;
