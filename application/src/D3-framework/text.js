import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';

/**
 *
 * @returns svg text
 */

const Text = ({ dimensions, svgRef }) => {
  const {
    height,
    width,
    margin: { top, right, bottom, left },
  } = dimensions;
  const { proxies } = React.useContext(ProxyContext);

  // convert the vh values to numbers
  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const text = svg.append('g');

    text
      .selectAll('text')
      .data(Array.from(proxies))
      .enter()
      .append('text')
      .attr('x', 50)
      .attr('y', ([id, proxy], idx) => idx * (localHeight / 10) + top)
      .attr('fill', ([id, proxy]) => proxy.getState().color)
      .text(([id, proxy], idx) => {
        const state = proxy.getState();
        return `${id}=${state.leftWrapper}${state.content}${state.rightWrapper}`;
      });

    return () => {
      text.remove();
    };
  }, [proxies]);

  return null;
};

export default Text;
