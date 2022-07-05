import { CRDTMethod } from '../types';
export const execute = ({ proc, parameters }) => {
    switch (proc) {
        case CRDTMethod.new: {
            // create a new proxy
        }
        case CRDTMethod.delete: {
            // remove a proxy
        }
        case CRDTMethod.replicate: {
            // replicate a proxy
        }
        case CRDTMethod.merge: {
            // merge two proxies
        }
        case CRDTMethod.apply: {
            // apply a proxy method to a proxy
        }
        default:
            throw new Error('cannot execute invalid code');
    }
};
