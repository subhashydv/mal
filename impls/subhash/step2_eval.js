const readline = require('readline');
const { reader_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalSymbol, MalList, MalVector, } = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const env = {
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
}

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value];
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => eval(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => eval(x, env));
    return new MalVector(newAst);
  }
  return ast;
}

const read = (str) => reader_str(str);

const eval = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);

  if (ast.isEmpty()) return ast;

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const print = (malValue) => pr_str(malValue);

const rep = (str) => print(eval(read(str), env));

const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });

repl();
