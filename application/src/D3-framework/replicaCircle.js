import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';
import Text from './text';

const ReplicaCircle = ({ dimensions, svgRef, position }) => {
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

  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const circles = svg.append('g');

    console.log(replicas);

    circles
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
      circles.remove();
      // cleanup function
    };
  }, [proxies]);

  return (
    <Text
      dimensions={{ ...dimensions, margin: { top: 55 } }}
      svgRef={svgRef}
      position={{ x: 50, y: 20 }}
    />
  );
};

export default ReplicaCircle;
