class Env {
  #outer
  constructor(outer, binds, exprs) {
    this.#outer = outer;
    this.binds = binds;
    this.exprs = exprs;
    this.data = {};
    this.doBinding();
  }

  doBinding() {
    if (this.exprs) {
      this.binds.forEach((binding, i) => {
        this.set(binding, this.exprs[i]);
      });
    }
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value]) {
      return this;
    }
    if (this.#outer) {
      return this.#outer.find(symbol);
    }

  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };