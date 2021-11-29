export default class IncOnlyCounter {
  constructor(n) {
    this.payload = new Array(n).fill(0);
    this.order = function (c) {
      for (let i = 0; i < n; i++) {
        const x = this.payload[i];
        const y = c[i];
        if (x > y) return false;
      }
      return true;
    };
    this.value = function () {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum = sum + this.payload[i];
      }
      return sum;
    };
    this.inc = function (i) {
      this.payload[i]++;
    };
    this.max = function (c) {
      for (let i = 0; i < n; i++) {
        const x = this.payload[i];
        const y = c[i];
        this.payload[i] = x > y ? x : y;
      }
    };
  }
}

const test = new IncOnlyCounter(3);
console.log(test.payload);
console.log(test.value());
test.payload = [1, 2, 3];
console.log(test.payload);
console.log(test.value());
console.log(test.payload === test.value());
