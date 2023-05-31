const { pr_str } = require("./printer");
const { MalList, MalNil, MalVector, MalValue } = require("./types");

const listCount = (list) => {
  if (list instanceof MalValue) {
    return list.value ? list.value.length : 0
  }
};

const prn = (args, append = '') => {
  console.log(args.map(pr_str).join(' ') + append);
  return new MalNil;
}

const coreMethod = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => a === b,
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
  'list': (...args) => new MalList(args),
  'vector': (...args) => new MalVector(args),
  'count': listCount,
  'list?': (args) => args instanceof MalValue,
  'empty?': (args) => listCount(args) === 0,
  'prn': (...args) => prn(args),
  'println': (...args) => prn(args, '\n'),
}

module.exports = { coreMethod };