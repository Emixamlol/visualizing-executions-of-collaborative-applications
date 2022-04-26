import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';

/**
 *
 * @returns svg text
 */

const Text = ({ dimensions, svgRef, position }) => {
  const {
    height,
    width,
    margin: { top, right, bottom, left },
  } = dimensions;
  const { x: xpos, y: ypos } = position;

  const { proxies } = React.useContext(ProxyContext);
  const replicas = (() => {
    let arr = [];
    for (const [id, [original, map]] of proxies.entries()) {
      arr = arr.concat(Array.from(map));
    }
    return arr;
  })();

  // convert the vh values to numbers
  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const text = svg.append('g');

    text
      .selectAll('text')
      .data(replicas)
      .enter()
      .append('text')
      .attr('x', ([id, proxy], idx) => {
        const dynamics = [
          localHeight,
          localWidth,
          proxy.getState().history,
          top,
          right,
          bottom,
          left,
          xpos,
          ypos,
        ];
        return xpos;
      })
      .attr('y', ([id, proxy], idx) => {
        const dynamics = [
          localHeight,
          localWidth,
          proxy.getState().history,
          top,
          right,
          bottom,
          left,
          xpos,
          ypos,
        ];
        const old = idx * (localHeight / 10) + top;
        return ypos + old;
      })
      .attr('fill', ([id, proxy]) => proxy.getState().color)
      .text(([id, proxy], idx) => {
        const state = proxy.getState();
        console.log(state.payload);
        return `${id}=${JSON.stringify(state.payload)}`;
      });

    return () => {
      text.remove();
    };
  }, [proxies]);

  return null;
};

export default Text;
