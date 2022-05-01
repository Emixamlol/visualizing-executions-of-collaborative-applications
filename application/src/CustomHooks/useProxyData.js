import { useContext } from 'react';
import { ProxyContext } from '../Proxy/state-handling';

/**
 * This custom hook gives back requested data from the proxy map
 *
 * @param {*} data: which data to get from the proxy map
 */

export const useProxyData = (data) => {
  const { proxies } = useContext(ProxyContext);

  let arr = [];

  switch (data) {
    case 'replicas': {
      for (const [id, [original, map]] of proxies.entries()) {
        arr = arr.concat(Array.from(map));
      }
      break;
    }

    case 'originals': {
      for (const [id, [original, map]] of proxies.entries()) {
        arr = arr.concat([[id].concat(Array.from(map.keys()))]);
      }
      break;
    }

    case 'histories': {
      for (const [id, [original, map]] of proxies.entries()) {
        for (const [replicaId, proxy] of map.entries()) {
          arr = arr.concat([
            proxy
              .getState()
              .history.map((obj) => [replicaId, Object.values(obj)]),
          ]);
        }
      }
      break;
    }

    default:
      throw Error('Cannot ask this data from proxies');
  }

  return [arr, proxies];
};
