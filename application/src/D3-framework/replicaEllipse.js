// display the different replicas of a crdt object in an ellipse as in Figure 7 from 'A comprehensive study of Convergent and Commutative Replicated Data Types'

import React, { useEffect } from 'react';
// import { ProxyContext } from '../Proxy/state-handling';
import { useProxyData } from '../CustomHooks/useProxyData';
import * as d3 from 'd3';
import ReplicaCircle from './replicaCircle';
import { arc } from 'd3';

const ReplicaEllipse = ({ dimensions, svgRef }) => {
  const {
    margin: { top, right, bottom, left },
  } = dimensions;

  const [originals, proxies] = useProxyData('originals');

  const crdtReplicaIds = (() => {
    let arr = [];
    // for (const [id, [original, map]] of proxies.entries()) {
    //   arr = arr.concat([[id].concat(Array.from(map.keys()))]);
    // }
    for (const [id, [original, map]] of proxies.entries()) {
      arr = arr.concat([[id].concat(Array.from(map.keys()))]);
    }
    return arr;
  })();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { height, width, x, y } = svgRef.current.getBoundingClientRect();
    const replicas = svg.append('g');

    console.log(originals);
    console.log(crdtReplicaIds);

    replicas
      .selectAll('text')
      .data(originals)
      .enter()
      .append('text')
      .attr('x', (crdt, idx) => {
        if (idx === 0) return 20;
        const priorAmount = originals[idx - 1].length;
      })
      .attr('y', (crdt, idx) => {
        if (idx === 0) return 20;
        const priorAmount = originals[idx - 1].length;
      })
      .attr('fill', 'black')
      .text((crdt, idx) => {
        const text = originals[idx].shift();
        return text;
      });

    replicas
      .selectAll('path')
      .data(originals)
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-dasharray', '10 10')
      .attr('d', (crdt, idx) => {
        const dynamics = [
          height,
          width,
          top,
          right,
          bottom,
          left,
          crdt.length,
          originals.length,
          x,
          y,
        ];
        const old = 'M 30 200 A 50 200 0 0 1 130 200 A 50 200 0 0 1 30 200';
        const d = `M ${x} ${y} 
        A 50 ${crdt.length * 10} 0 0 1 130 ${
          (height / originals.length) * (idx + 1)
        } A 50 ${crdt.length * 20} 0 0 1 30 ${
          (height / originals.length) * (idx + 1)
        }`;
        return old;
      });

    return () => {
      replicas.remove();
    };
  }, [proxies]);

  return <ReplicaCircle dimensions={dimensions} svgRef={svgRef} />;
};

export default ReplicaEllipse;
