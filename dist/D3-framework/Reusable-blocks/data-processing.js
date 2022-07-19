// process the entire data into different sets of data needed for the d3 api
export const processData = (data, key) => {
    switch (key) {
        case 'objects':
            return data.map(([id, replicas]) => id);
        case 'replicas':
            break;
        default:
            const assertUnreachable = (x) => {
                throw new Error("Didn't expect to get here");
            };
            assertUnreachable(key);
    }
};
