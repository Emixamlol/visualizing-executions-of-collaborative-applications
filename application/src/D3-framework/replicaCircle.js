import React, { useEffect } from 'react';
import { useProxyData } from '../CustomHooks/useProxyData';
import * as d3 from 'd3';

const ReplicaCircle = ({ dimensions, svgRef }) => {
  const {
    margin: { top, right, bottom, left },
  } = dimensions;

  const [replicas, proxies] = useProxyData('replicas');

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { height, width, x, y } = svgRef.current.getBoundingClientRect();
    const circles = svg.append('g');

    circles
      .selectAll('circle')
      .data(replicas)
      .enter()
      .append('circle')
      .attr('cx', () => width / 11 + right)
      .attr('cy', (d, idx) => idx * (height / 10) + top)
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', ([, proxy]) => proxy.getState().color);

    circles
      .selectAll('text')
      .data(replicas)
      .enter()
      .append('text')
      .attr('x', width / 12 + right)
      .attr('y', (d, idx) => idx * (height / 10) + top + y)
      .attr('fill', ([, proxy]) => proxy.getState().color)
      .text(([id]) => `${id}`);

    return () => {
      circles.remove();
      // cleanup function
    };
  }, [proxies]);

  return null;
};

export default ReplicaCircle;
