import React, { useEffect } from 'react';
import { ProxyContext } from '../Proxy/state-handling';

/**
 *
 * @returns the svg point which represents the crdt
 */

const BasicState = ({ dimensions, svgRef }) => {
  const proxies = React.useContext(ProxyContext);

  return <div>Basic State</div>;
};

export default BasicState;
