import { createCRDT } from '../CRDTs/create-crdt';
import { sendObjectId, sendReplicaId, positionMergedReplicas, } from '../D3-framework/Svg/specific-svg';
import { CRDTtype, } from '../types/crdt-types';
import { Message, } from '../types/proxy-types';
export default class CrdtProxy {
    constructor(id, crdt, params) {
        // private method to update the state
        this.updateState = (msg) => {
            const payload = this.crdtReplica.payload(); // get the current payload
            this.state = Object.assign(Object.assign({}, this.state), { payload, history: this.state.history.concat({ msg, payload }) });
            sendReplicaId(this.id);
            sendObjectId(this.replicaName);
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
        // positionMergedReplicas
        // positionMergedReplicas
        this.setupMergeVisualization = (other) => {
            sendObjectId(null); // make sure to delete all specific visualizations
            // visualize other replica (sender)
            sendObjectId(other.replicaName);
            sendReplicaId(other.id);
            other.crdtReplica.visualize();
            // visualize this replica (receiver)
            sendReplicaId(this.id);
            this.crdtReplica.visualize();
            positionMergedReplicas(other.id, this.id);
        };
        this.merge = (other) => {
            if (this.replicaName === other.replicaName) {
                this.setupMergeVisualization(other); // set up the specific visualization of the merge
                // perform the merge on the replicas and update the state
                this.crdtReplica = this.crdtReplica.merge(other.crdtReplica);
                this.state = Object.assign(Object.assign({}, this.state), { merges: this.state.merges.concat({
                        from: {
                            other_id: other.id,
                            history_index: other.getState().history.length - 1,
                        },
                        to: this.state.history.length,
                    }) });
                this.updateState(Message.merge);
                this.crdtReplica.visualize();
                // sendObjectId(this.replicaName);
                // this.crdtReplica.visualize();
                // sendReplicaId(other.id);
                // other.crdtReplica.visualize();
                // positionMergedReplicas(this.id, other.id);
            }
        };
        this.apply = (fn, params) => {
            console.log(this);
            this.crdtReplica[fn].apply(this.crdtReplica, params);
            this.updateState(Message.update);
            this.crdtReplica.visualize(); // visualize the update
        };
        this.visualize = () => {
            console.log(this);
            this.crdtReplica.visualize();
        };
        this.replicate = (replicaId, pid) => {
            const maxProcesses = this.crdtReplica.getTimestamp().length;
            if (pid < maxProcesses) {
                const newProxy = new CrdtProxy(replicaId, this.crdtReplica.type, [
                    maxProcesses.toString(),
                    pid.toString(),
                ]);
                newProxy.replicaName = this.replicaName; // the replicaName is the same for each replica
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
        // this.crdtReplica = revisitedCreateCRDT(crdt, params);
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
