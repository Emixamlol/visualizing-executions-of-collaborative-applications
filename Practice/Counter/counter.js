import IncOnlyCounter from "./incOnlyCounter.js";

class Counter {
  constructor(n) {
    this.I = new IncOnlyCounter(n);
    this.D = new IncOnlyCounter(n);
    this.value = function () {
      return this.I.value() - this.D.value();
    };
    this.inc = function () {
      this.I.inc();
    };
    this.dec = function () {
      this.D.inc();
    };
    this.order = function (c) {
      if (this.I.order(c.I) && this.D.order(c.D)) {
        return true;
      }
      return false;
    };
  }
}
