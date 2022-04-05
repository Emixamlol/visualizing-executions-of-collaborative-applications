import { IdGenerator } from './id-generator';

export const execute = ({ proc, parameters }, proxyFunctionality) => {
  const { addProxy, removeProxy, applyProxy } = proxyFunctionality;

  console.log(proc, parameters);

  switch (proc) {
    case 'new': {
      const [name, crdt, ...params] = parameters;
      addProxy({ id: name, crdt, params });
      break;
    }

    case 'delete': {
      const [name] = parameters;
      removeProxy(name);
      break;
    }

    case 'apply': {
      const [name, fn, ...params] = parameters;
      applyProxy(name, fn, params);
      break;
    }

    default:
      throw new Error('cannot execute invalid code');
  }
};
