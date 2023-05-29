const readline = require('readline');
const { reader_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalSymbol, MalList, MalVector, } = require('./types');
const { Env } = require('./env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const _env = {
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
}

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
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

const partitionBy = (list, by) => {
  const partitioned = [];
  for (let index = 0; index < list.length; index += by) {
    partitioned.push([list[index], list[index + 1]]);
  }
  return partitioned;
}

const eval = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);

  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], eval(ast.value[2], env));
      return env.get(ast.value[1]);
    case 'let*':
      const newEnv = new Env(env);
      const values = partitionBy(ast.value[1].value, 2);
      values.forEach(([key, value]) => {
        newEnv.set(key, eval(value, newEnv));
      })

      return eval(ast.value[2], newEnv);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const print = (malValue) => pr_str(malValue);

const env = new Env();
env.set(new MalSymbol('+'), (...args) => args.reduce((x, y) => x + y, 0));
env.set(new MalSymbol('*'), (...args) => args.reduce((x, y) => x * y, 1));
env.set(new MalSymbol('-'), (...args) => args.reduce((x, y) => x - y));
env.set(new MalSymbol('/'), (...args) => args.reduce((x, y) => Math.round(x / y)));


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
