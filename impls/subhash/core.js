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

const coreMethod = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => deepEqual(a, b),
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
  'list': (...args) => new MalList(args),
  'vector': (...args) => new MalVector(args),
  'count': listCount,
  'list?': (args) => args instanceof MalList,
  'empty?': (args) => listCount(args) === 0,
  'prn': (...args) => prn(args),
  'pr-str': (...args) => prn(args),
  'println': (...args) => prn(args, '\n'),
}

module.exports = { coreMethod };