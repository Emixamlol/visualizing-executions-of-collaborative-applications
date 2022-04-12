import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';

/**
 *
 * @returns the svg point which represents the crdt
 */

const Point = ({ dimensions, svgRef }) => {
  const proxies = React.useContext(ProxyContext);

  return <div>Point</div>;
};

export default Point;
