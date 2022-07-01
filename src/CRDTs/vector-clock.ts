interface VectorClockInterface {
  increase: (pid: number) => void;

  merge: (vc: VectorClock) => VectorClock;

  isEqual: (vc: VectorClock) => boolean;

  lessOrEqual: (vc: VectorClock) => boolean;

  less: (vc: VectorClock) => boolean;

  getVector: () => number[];
}

export default class VectorClock implements VectorClockInterface {
  private vector: number[] = [];
  readonly length: number = 0;

  constructor(n: number) {
    this.length = n;
    this.vector = new Array(n).fill(0);
  }

  increase = (pid: number): void => {
    this.vector[pid]++;
  };

  merge = (vc: VectorClock): VectorClock => {
    const rvc: VectorClock = new VectorClock(this.length); // result vector clock
    for (let i = 0; i < this.length; i++) {
      rvc.vector[i] = Math.max(this.vector[i], vc.vector[i]);
    }
    return rvc;
  };

  isEqual = (vc: VectorClock): boolean => {
    for (let i = 0; i < this.length; i++) {
      if (this.vector[i] !== vc.vector[i]) return false;
    }
    return true;
  };

  lessOrEqual = (vc: VectorClock): boolean => {
    for (let i = 0; i < this.length; i++) {
      if (this.vector[i] > vc.vector[i]) return false;
    }
    return true;
  };

  less = (vc: VectorClock): boolean => {
    for (let i = 0; i < this.length; i++) {
      if (this.vector[i] > vc.vector[i] || this.vector[i] === vc.vector[i])
        return false;
    }
    return true;
  };

  getVector = (): number[] => this.vector.slice();
}
