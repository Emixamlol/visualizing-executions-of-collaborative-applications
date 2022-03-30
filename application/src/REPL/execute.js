import { IdGenerator } from './id-generator';

export const execute = ({ proc, parameters }, proxyFunctionality) => {
  const { addProxy, removeProxy } = proxyFunctionality;

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

    default:
      break;
  }
};
