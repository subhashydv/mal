const areBothArrays = (element1, element2) => {
  return Array.isArray(element1) && Array.isArray(element2);
};

const deepEqual = (malValue1, malValue2) => {
  const list1 = malValue1 instanceof MalValue ? malValue1.value : malValue1;
  const list2 = malValue2 instanceof MalValue ? malValue2.value : malValue2;

  if (!areBothArrays(list1, list2)) {
    return list1 === list2;
  }

  if (list1.length !== list2.length) {
    return false;
  }

  for (let index = 0; index < list1.length; index++) {
    if (!deepEqual(list1[index], list2[index])) {
      return false;
    }
  }

  return true;
};

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

  equals(otherMalValue) {
    return otherMalValue instanceof MalValue
      && deepEqual(this.value, otherMalValue.value);
  }
}

class MalSeq extends MalValue {
  constructor(value) {
    super(value)
  }

  nth(n) {
    if (n >= this.value.length) {
      throw "index out of range"
    }
    return this.value[n];
  }

  first() {
    if (this.value.length == 0) {
      return new MalNil();
    }
    return this.value[0];
  }

  rest() {
    return new MalList(this.value.slice(1));
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value)
  }

  equals(otherMalSymbol) {
    return otherMalSymbol instanceof MalSymbol
      && deepEqual(this.value, otherMalSymbol.value);
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return prStr(this.value);
  }

  equals(otherMalString) {
    return otherMalString instanceof MalString
      && deepEqual(this.value, otherMalString.value);
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

  equals(otherMalList) {
    return otherMalList instanceof MalList
      && deepEqual(this.value, otherMalList.value);
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

  equals(otherMalList) {
    return otherMalList instanceof MalVector
      && deepEqual(this.value, otherMalList.value);
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

  equals(otherMalList) {
    return otherMalList instanceof this
      && deepEqual(this.value, otherMalList.value);
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null)
  }

  pr_str() {
    return 'nil';
  }

  equals(otherMalNil) {
    return otherMalNil instanceof MalNil
      && deepEqual(this.value, otherMalNil.value);
  }

  rest() {
    return '()';
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env, fn, isMacro = false) {
    super(ast);
    this.binds = binds;
    this.env = env;
    this.fn = fn;
    this.isMacro = isMacro;
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

  equals(otherAtom) {
    return otherAtom instanceof MalAtom
      && deepEqual(this.value, otherAtom.value);
  }
}

module.exports = { MalSymbol, MalList, MalVector, MalValue, MalNil, MalHashMap, MalKeyword, MalString, MalFunction, createMalString, prStr, MalAtom, MalSeq };