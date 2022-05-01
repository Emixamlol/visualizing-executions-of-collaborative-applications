import React, { useEffect } from 'react';
// import { ProxyContext } from '../Proxy/state-handling';
import { useProxyData } from '../CustomHooks/useProxyData';
import * as d3 from 'd3';

/**
 *
 * @returns the svg point which represents the crdt
 */

const BasicState = ({ dimensions, svgRef }) => {
  const {
    margin: { top, right, bottom, left },
  } = dimensions;

  const [replicas, proxies] = useProxyData('replicas');
  const [histories] = useProxyData('histories');

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { height, width, x, y } = svgRef.current.getBoundingClientRect();
    const basicStates = svg.append('g');

    const circles = basicStates
      .selectAll('path')
      .data(histories)
      .enter()
      .selectAll('circle')
      .data((data) => {
        console.log(data);
        return data;
      })
      .enter()
      .append('circle')
      .attr(
        'cx',
        ([id, [msg, payload]], idx) => x + width / 5 + idx * (x + width / 6)
      )
      .attr('cy', ([id, [msg, payload]]) => {
        const idx = replicas.findIndex(
          ([replicaId, proxy]) => id === replicaId
        );
        return idx * (height / 10) + top;
      })
      .attr('r', 10)
      .attr('fill', ([id, [msg, payload]]) => {
        const [, proxy] = replicas.find(
          ([replicaId, proxy]) => id === replicaId
        );
        return proxy.getState().color;
      });

    const text = basicStates
      .selectAll('path')
      .data(histories)
      .enter()
      .selectAll('text')
      .data((data) => data)
      .enter()
      .append('text')
      .attr(
        'x',
        ([id, [msg, payload]], idx) => x + width / 5 + idx * (x + width / 6)
      )
      .attr('y', ([id, [msg, payload]]) => {
        const idx = replicas.findIndex(
          ([replicaId, proxy]) => id === replicaId
        );
        return idx * (height / 10) + top - y;
      })
      .attr('fill', ([id, [msg, payload]]) => {
        const [, proxy] = replicas.find(
          ([replicaId, proxy]) => id === replicaId
        );
        return proxy.getState().color;
      })
      .text(([id, [msg, payload]]) => `${id}=${JSON.stringify(payload)}`);

    console.log(replicas);
    console.log(histories);

    // basicStates.selectAll('text').data(histories).enter().append('text').attr('x')

    return () => {
      // cleanup function
      circles.remove();
      text.remove();
      basicStates.remove();
    };
  }, [proxies]);

  return null;
};

export default BasicState;
