import { ParsedCode } from '../types/repl-types';
import { ProxyMethod } from '../types/proxy-types';

export const execute = ({ proc, parameters }: ParsedCode): void => {
  switch (proc) {
    case ProxyMethod.new: {
      // create a new proxy
      console.log(`Executing ${proc} with parameters ${parameters}`);
      break;
    }

    case ProxyMethod.delete: {
      // remove a proxy
      console.log(`Executing ${proc} with parameters ${parameters}`);
      break;
    }

    case ProxyMethod.replicate: {
      // replicate a proxy
      console.log(`Executing ${proc} with parameters ${parameters}`);
      break;
    }

    case ProxyMethod.merge: {
      // merge two proxies
      console.log(`Executing ${proc} with parameters ${parameters}`);
      break;
    }

    case ProxyMethod.apply: {
      // apply a proxy method to a proxy
      console.log(`Executing ${proc} with parameters ${parameters}`);
      break;
    }

    default:
      throw new Error('cannot execute invalid code');
  }
};
