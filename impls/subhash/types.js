class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value)
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value)
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value)
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value)
  }

  isEmpty() {
    return this.value.length === 0;
  }

  printer(x) {
    if (x instanceof MalValue)
      return x.pr_str();
    return x.toString();
  }

  pr_str() {
    return '(' + this.value.map(x => this.printer(x)).join(' ') + ')';
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value)
  }

  isEmpty() {
    return this.value.length === 0;
  }

  printer(x) {
    if (x instanceof MalValue)
      return x.pr_str();
    return x.toString();
  }

  pr_str() {
    return '[' + this.value.map(x => this.printer(x)).join(' ') + ']';
  }
}

class MalHashMap extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return '{' + this.value.map(x => x.pr_str()).join(' ') + '}';
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null)
  }

  pr_str() {
    return 'nil';
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env) {
    super(ast);
    this.binds = binds;
    this.env = env;
  }

  pr_str() {
    return '#<Function>';
  }
}

module.exports = { MalSymbol, MalList, MalVector, MalValue, MalNil, MalHashMap, MalKeyword, MalString, MalFunction };