const createMalString = (str) => {
  return new MalString(str.replace(/\\(.)/g, (y, captured) =>
    captured == "n" ? "\n" : captured));
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

class MalSeq extends MalValue {
  constructor(value) {
    super(value)
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

  pr_str() {
    return prStr(this.value);
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value)
  }
}

class MalList extends MalSeq {
  constructor(value) {
    super(value)
  }

  isEmpty() {
    return this.value.length === 0;
  }

  pr_str() {
    return '(' + this.value.map(x => prStr(x)).join(' ') + ')';
  }
}



class MalVector extends MalSeq {
  constructor(value) {
    super(value)
  }

  isEmpty() {
    return this.value.length === 0;
  }


  pr_str() {
    return '[' + this.value.map(x => prStr(x)).join(' ') + ']';
  }
}

class MalHashMap extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return '{' + this.value.map(x => prStr(x)).join(' ') + '}';
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
    this.value = f.apply(null, [this.value, ...args]);
    return this.value;
  }
}

module.exports = { MalSymbol, MalList, MalVector, MalValue, MalNil, MalHashMap, MalKeyword, MalString, MalFunction, createMalString, prStr, MalAtom, MalSeq };