import { createCRDT } from '../CRDTs/create-crdt';
import { CRDTtype } from '../types/crdt-types';
import { Message, } from '../types/proxy-types';
export default class CrdtProxy {
    constructor(id, crdt, params) {
        // private method to update the state
        this.updateState = (msg) => {
            const payload = this.crdtReplica.payload(); // get the current payload
            this.state = Object.assign(Object.assign({}, this.state), { payload, history: this.state.history.concat({ msg, payload }) });
        };
        this.query = (args) => {
            switch (this.crdtReplica.type) {
                case CRDTtype.counter:
                case CRDTtype.register:
                    return this.crdtReplica.value();
                case CRDTtype.set:
                    return this.crdtReplica.lookup(args[0]);
                default:
                    throw new Error('cannot query invalid crdt');
            }
        };
        this.merge = (other) => {
            if (this.replicaName === other.replicaName) {
                this.crdtReplica = this.crdtReplica.merge(other.crdtReplica);
                this.state = Object.assign(Object.assign({}, this.state), { merges: this.state.merges.concat({
                        from: {
                            other_id: other.id,
                            history_index: other.getState().history.length - 1,
                        },
                        to: this.state.history.length,
                    }) });
                this.updateState(Message.merge);
            }
        };
        this.apply = (fn, params) => {
            console.log(this);
            this.crdtReplica[fn].apply(this.crdtReplica, params);
            this.updateState(Message.update);
        };
        this.replicate = (replicaId, pid) => {
            const maxProcesses = this.crdtReplica.getTimestamp().length;
            if (pid < maxProcesses) {
                const newProxy = new CrdtProxy(replicaId, this.crdtReplica.type, [
                    maxProcesses.toString(),
                    pid.toString(),
                ]);
                newProxy.replicaName = this.replicaName; // the replicaName is the same for each replica
                newProxy.state = Object.assign({}, this.state); // the state is replicated as well
                return newProxy;
            }
            // in case the maximum number of possible replicas exist, do not replicate and return null
            return null;
        };
        this.getState = () => Object.assign({}, this.state); // return a copy of the state, not the state itself
        this.getType = () => this.crdtReplica.type;
        this.id = id;
        this.replicaName = id;
        this.crdtReplica = createCRDT(crdt, params);
        this.state = {
            history: [
                {
                    msg: Message.initialized,
                    payload: this.crdtReplica.payload(),
                },
            ],
            payload: this.crdtReplica.payload(),
            merges: [],
        };
    }
}
