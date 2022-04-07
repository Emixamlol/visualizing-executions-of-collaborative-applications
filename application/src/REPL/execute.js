export const execute = ({ proc, parameters }, proxyFunctionality) => {
  const { addProxy, removeProxy, mergeProxy, applyToProxy } =
    proxyFunctionality;

  console.log(proc, parameters);

  switch (proc) {
    case 'new': {
      const [id, crdt, ...params] = parameters;
      addProxy(id, crdt, params);
      break;
    }

    case 'delete': {
      const [id] = parameters;
      removeProxy(id);
      break;
    }

    case 'merge': {
      const [id, other_id] = parameters;
      mergeProxy(id, other_id);
      break;
    }

    case 'apply': {
      const [id, fn, ...params] = parameters;
      applyToProxy(id, fn, params);
      break;
    }

    default:
      throw new Error('cannot execute invalid code');
  }
};
