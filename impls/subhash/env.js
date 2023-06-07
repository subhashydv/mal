const { MalList } = require("./types");
class Env {
  constructor(outer, binds = [], exprs) {
    this.outer = outer;
    this.binds = binds;
    this.exprs = exprs;
    this.data = {};
    this.doBinding();
  }

  doBinding() {
    for (let i = 0; i < this.binds.length; i++) {
      if (this.binds[i].value === '&') {
        this.set(this.binds[i + 1], new MalList(this.exprs.slice(i)));
        return;
      }
      this.set(this.binds[i], this.exprs[i]);
    }
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }
    if (this.outer) {
      return this.outer.find(symbol);
    }

  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };