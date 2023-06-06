const createMalString = (str) => {
  return str.replace(/\\(.)/g, (y, captured) =>
    captured == "n" ? "\n" : captured);
};

const prStr = (malValue, printReadably = true) => {
  if (typeof malValue === 'function') return '#<function>';
  if (malValue instanceof MalValue) {
    if (printReadably && malValue instanceof MalString) {
      return `"${toPrintedRepresentation(malValue.pr_str())}"`;
    }
    return malValue.pr_str();
  }

  return malValue.toString();
};

const toPrintedRepresentation = (str) => str
  .replace(/\\/g, '\\\\')
  .replace(/\n/g, '\\n')
  .replace(/\"/g, '\\\"');



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

class MalAtom extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return '(atom ' + super.pr_str() + ')';
  }

  deref() {
    return this.value;
  }

  reset(resetValue) {
    this.value = resetValue;
    return this.value;
  }

  swap(f, args) {
    // console.log('f : ', f);
    // console.log('args : ', args);
    this.value = f.apply(null, [this.value, ...args]);
    return this.value;
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return prStr(this.value);
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
    return '(' + this.value.map(x => prStr(x)).join(' ') + ')';
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
  constructor(ast, binds, env, fn) {
    super(ast);
    this.binds = binds;
    this.env = env;
    this.fn = fn;
  }

  pr_str() {
    return '#<Function>';
  }

  apply(ctx, args) {
    return this.fn.apply(null, args);
  }
}

module.exports = { MalSymbol, MalList, MalVector, MalValue, MalNil, MalHashMap, MalKeyword, MalString, MalFunction, createMalString, prStr, MalAtom };