export const execute = ({ proc, parameters }, proxyFunctionality) => {
  const { addProxy, removeProxy, replicateProxy, mergeProxy, applyToProxy } =
    proxyFunctionality;

  console.log(proc, parameters);

  switch (proc) {
    case 'new': {
      const [id, crdt, ...params] = parameters;
      addProxy(id, crdt, params);
      break;
    }

    case 'delete': {
      const [id, ...replicas] = parameters;
      removeProxy(id, replicas);
      break;
    }

    case 'replicate': {
      const [idToReplicate, name] = parameters; // which object to replicate and the name of the new replica
      replicateProxy(idToReplicate, name);
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
