import React, { useEffect, useContext } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';
import Text from './text';

/**
 *
 * @returns an svg path which represents the timeline of a CRDT
 */

const Timeline = ({ dimensions, svgRef }) => {
  const {
    height,
    width,
    margin: { top, right, bottom, left },
  } = dimensions;

  const { proxies } = useContext(ProxyContext);
  const replicas = (() => {
    let arr = [];
    for (const [id, [original, map]] of proxies.entries()) {
      arr = arr.concat(Array.from(map));
    }
    return arr;
  })();
  //   const timelines = svg.append('g');

  // convert the vh values to numbers
  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  console.log(localHeight);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const timelines = svg.append('g');

    timelines
      .selectAll('path')
      .data(replicas)
      .enter()
      .append('path')
      .attr('stroke', ([id, proxy]) => proxy.getState().color)
      .attr(
        'd',
        ([id, proxy], idx) =>
          `M 150 ${idx * (localHeight / 10) + top} l ${localWidth - 150} 0`
      );

    // cleanup function
    return () => {
      timelines.remove();
    };
  }, [proxies]);

  return (
    <Text
      dimensions={{ ...dimensions, margin: { top: 55 } }}
      svgRef={svgRef}
      position={{ x: 160, y: -20 }}
    />
  );
};

export default Timeline;
