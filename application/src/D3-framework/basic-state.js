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
  const replicas = (() => {
    let arr = [];
    for (const [id, [original, map]] of proxies.entries()) {
      arr = arr.concat(Array.from(map));
    }
    return arr;
  })();

  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const basicStates = svg.append('g');

    console.log(replicas);

    basicStates
      .selectAll('circle')
      .data(replicas)
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
