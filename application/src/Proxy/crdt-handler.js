// defines handler object for the CRDT proxies

export const crdt_handler = {
  get: (obj, property) => {
    console.log('calling proxy get');
    console.log(obj, property);
    return property in obj ? obj[property] : 'property does not exist';
  },

  set: () => {
    throw new Error('cannot mutate crdt properties this way');
  },
};
