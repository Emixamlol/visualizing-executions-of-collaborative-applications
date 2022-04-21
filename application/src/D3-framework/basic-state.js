import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';

/**
 *
 * @returns the svg point which represents the crdt
 */

const BasicState = ({ dimensions, svgRef }) => {
  const {
    height,
    width,
    margin: { top, right, bottom, left },
  } = dimensions;

  const { proxies } = React.useContext(ProxyContext);

  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const basicStates = svg.append('g');

    console.log(Array.from(proxies));

    basicStates
      .selectAll('circle')
      .data(Array.from(proxies))
      .enter()
      .append('circle')
      .attr('cx', ([id, proxy]) => 170)
      .attr('cy', ([id, proxy], idx) => idx * (localHeight / 10) + top)
      .attr('r', 10)
      .attr('fill', ([id, proxy]) => {
        console.log(proxy);
        return proxy.getState().color;
      });

    return () => {
      basicStates.remove();
      // cleanup function
    };
  }, [proxies]);

  return null;
};

export default BasicState;
