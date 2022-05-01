// display the different replicas of a crdt object in an ellipse as in Figure 7 from 'A comprehensive study of Convergent and Commutative Replicated Data Types'

import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';
import * as d3 from 'd3';
import ReplicaCircle from './replicaCircle';

const ReplicaEllipse = ({ dimensions, svgRef }) => {
  const {
    height,
    width,
    margin: { top, right, bottom, left },
  } = dimensions;

  const { proxies } = React.useContext(ProxyContext);
  const crdtReplicaIds = (() => {
    let arr = [];
    for (const [id, [original, map]] of proxies.entries()) {
      arr = arr.concat([[id].concat(Array.from(map.keys()))]);
    }
    return arr;
  })();

  const localHeight = (parseInt(height, 10) * visualViewport.height) / 100;
  const localWidth = (parseInt(width, 10) * visualViewport.width) / 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const replicas = svg.append('g');

    replicas
      .selectAll('text')
      .data(crdtReplicaIds)
      .enter()
      .append('text')
      .attr('x', (crdt, idx) => {
        if (idx === 0) return 20;
        const priorAmount = crdtReplicaIds[idx - 1].length;
      })
      .attr('y', (crdt, idx) => {
        if (idx === 0) return 20;
        const priorAmount = crdtReplicaIds[idx - 1].length;
      })
      .attr('fill', 'black')
      .text((crdt, idx) => {
        const text = crdtReplicaIds[idx].shift();
        return text;
      });

    replicas
      .selectAll('path')
      .data(crdtReplicaIds)
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-dasharray', '10 10')
      .attr('d', (crdt, idx) => {
        const dynamics = [
          localHeight,
          localWidth,
          top,
          right,
          bottom,
          left,
          crdt.length,
          crdtReplicaIds.length,
        ];
        const old = 'M 30 200 A 50 200 0 0 1 130 200 A 50 200 0 0 1 30 200';
        const d = `M 30 ${
          (localHeight / crdtReplicaIds.length) * (idx + 1)
        } A 50 ${crdt.length * 10} 0 0 1 130 200 A 50 ${
          crdt.length * 200
        } 0 0 1 0 0`;
        return old;
      });

    return () => {
      replicas.remove();
    };
  }, [proxies]);

  // return null;
  return (
    ////<ReplicaCircle
    ////  dimensions={dimensions}
    ////  svgRef={svgRef}
    ////  position={{ x: 30, y: 40 }}
    /////>
    null
  );
};

export default ReplicaEllipse;
