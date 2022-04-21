import VectorClock from './vector-clock';

export default class CRDT {
  _pid; // which process is handling this replica
  _timestamp; // vector clock

  // the constructor takes the process id as parameter, and the amount of processes (different replicas) there can be
  constructor(maxProcesses, pid) {
    this._pid = pid; // id of the process which is handling this replica
    this._timestamp = new VectorClock(maxProcesses);
  }

  get _pid() {
    return this._pid;
  }

  get _timestamp() {
    return this._timestamp;
  }
}
