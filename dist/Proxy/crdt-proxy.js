import { createCRDT } from '../CRDTs/create-crdt';
import { CRDT } from '../types/crdt-types';
import { colorGenerator, Msg, } from '../types/proxy-types';
export default class CrdtProxy {
    constructor(id, crdt, params) {
        this.query = (...args) => {
            switch (this.crdtReplica.type) {
                case CRDT.counter:
                case CRDT.register:
                    return this.crdtReplica.value();
                case CRDT.set:
                    return this.crdtReplica.lookup(args[0]);
                default:
                    throw new Error('cannot query invalid crdt');
            }
        };
        this.id = id;
        this.replicaName = id;
        this.crdtReplica = createCRDT(crdt, params);
        this.state = {
            history: [
                {
                    msg: Msg.initialized,
                    payload: this.crdtReplica.payload(),
                },
            ],
            payload: this.crdtReplica.payload(),
            color: colorGenerator.next().value,
        };
    }
}
