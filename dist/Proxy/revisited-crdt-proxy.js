import { revisitedCreateCRDT } from '../CRDTs/create-crdt';
import { Message, } from '../types/proxy-types';
export default class RevisitedCrdtProxy {
    constructor(id, type, params) {
        // private method to update the state
        this.updateState = (msg) => {
            const [element, timestamp] = this.crdtReplica.getPayload(); // get the current payload
            const payload = [
                JSON.stringify(element),
                timestamp.getVector(),
            ];
            this.state = Object.assign(Object.assign({}, this.state), { payload, history: this.state.history.concat({ msg, payload }) });
        };
        this.merge = (other) => {
            if (this.replicaName === other.replicaName) {
                this.crdtReplica.merge(other.crdtReplica.getPayload());
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
        this.replicate = (replicaId, pid) => {
            const maxProcesses = this.crdtReplica.getPayload()[1].length;
            if (pid < maxProcesses) {
                const newProxy = new RevisitedCrdtProxy(replicaId, this.crdtReplica.type, [maxProcesses.toString(), pid.toString()]);
                newProxy.replicaName = this.replicaName; // the replicaName is the same for each replica
                newProxy.state = Object.assign({}, this.state); // the state is replicated as well
                return newProxy;
            }
            // in case the maximum number of possible replicas exist, do not replicate and return null
            return null;
        };
        this.getState = () => Object.assign({}, this.state);
        this.id = id;
        this.replicaName = id;
        this.crdtReplica = revisitedCreateCRDT(type, params);
        const [element, timestamp] = this.crdtReplica.getPayload();
        const payload = [
            JSON.stringify(element),
            timestamp.getVector(),
        ];
        this.state = {
            history: [
                {
                    msg: Message.initialized,
                    payload,
                },
            ],
            payload,
            merges: [],
        };
    }
    apply(op, fn, params) {
        this.crdtReplica[op][fn].apply(this.crdtReplica, params);
        this.updateState(Message.update);
    }
}
