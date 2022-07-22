// process the entire data into different sets of data needed for the d3 api
export const processData = (data, key) => {
    switch (key) {
        case 'objectIds':
            return data.map(([id]) => id);
        case 'replicas':
            return data.map(([, replicas]) => replicas);
        case 'replicaIds':
            return data
                .map(([, replicas]) => replicas.map(({ id }) => id))
                .flat();
        case 'states':
            return data
                .map(([, replicas]) => replicas.map(({ state }) => state))
                .flat();
        default:
            const assertUnreachable = (x) => {
                throw new Error("Didn't expect to get here");
            };
            assertUnreachable(key);
    }
};
