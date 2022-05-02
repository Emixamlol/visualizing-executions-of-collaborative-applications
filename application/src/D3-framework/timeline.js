import React, { useEffect } from 'react';
import { useProxyData } from '../CustomHooks/useProxyData';
import * as d3 from 'd3';

/**
 *
 * @returns an svg path which represents the timeline of a CRDT
 */

const Timeline = ({ dimensions, svgRef }) => {
  const {
    margin: { top, right, bottom, left },
  } = dimensions;

  const [replicas, proxies] = useProxyData('replicas');
  // const { proxies } = useContext(ProxyContext);
  // const replicas = (() => {
  //   let arr = [];
  //   for (const [id, [original, map]] of proxies.entries()) {
  //     arr = arr.concat(Array.from(map));
  //   }
  //   return arr;
  // })();
  //   const timelines = svg.append('g');

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { height, width, x, y } = svgRef.current.getBoundingClientRect();
    console.log(svg);
    console.log(svg.node());
    console.log(svgRef.current.getBoundingClientRect());
    console.log(document.getElementById('general-visualization'));
    console.log(
      svgRef.current.getBoundingClientRect().height,
      svgRef.current.getBoundingClientRect().width
    );
    console.log(x, y);
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
          `M ${x + width / 5} ${idx * (height / 10) + top} l ${
            width - (x + width / 5)
          } 0`
      );

    // cleanup function
    return () => {
      timelines.remove();
    };
  }, [proxies]);

  return null;
};

export default Timeline;
