const { reader_str } = require("./reader");
const { MalList, MalNil, MalVector, MalValue, MalString, MalAtom, prStr } = require("./types");
const fs = require('fs');

const listCount = (list) => {
  if (list instanceof MalValue) {
    return list.value ? list.value.length : 0
  }
};

const print = (args, printReadably) => {
  console.log(...args.map((arg) => prStr(arg, printReadably)));
  return new MalNil();
};

const isEqual = (a, b) => {
  if (a instanceof MalValue) {
    return a.equals(b);
  }
  return a === b;
}

const coreMethod = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => isEqual(a, b),
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
  'list': (...args) => new MalList(args),
  'vector': (...args) => new MalVector(args),
  'count': listCount,
  'list?': (args) => args instanceof MalList,
  'empty?': (args) => listCount(args) === 0,
  'prn': (...args) => print(args, true),
  'println': (...args) => print(args, false),
  'pr-str': (...args) => {
    const str = args.map((arg) => prStr(arg, true)).join(' ');
    return new MalString(str);
  },
  'str': (...args) => {
    const str = args.map((arg) => prStr(arg, false)).join('');
    return new MalString(str);
  },
  'read-string': (string) => {
    if (string instanceof MalString) {
      return reader_str(string.value);
    }
    return reader_str(string)
  },
  'slurp': (filename) => new MalString(fs.readFileSync(filename, 'utf8')),
  'atom': (args) => new MalAtom(args),
  'atom?': (args) => args instanceof MalAtom,
  'deref': (args) => args.deref(),
  'reset!': (atom, newValue) => atom.reset(newValue),
  'swap!': (atom, f, ...args) => atom.swap(f, args),
  'cons': (value, list) => new MalList([value, ...list.value]),
  'concat': (...lists) => new MalList(lists.flatMap(x => x.value)),
  'vec': (args) => new MalVector(args.value),
  "*ARGV*": new MalList(process.argv.slice(2)),
  nth: (list, n) => list.nth(n),
  first: (list) => list instanceof MalNil ? new MalNil() : list.first(),
  rest: (list) => list.rest(),
}

module.exports = { coreMethod };