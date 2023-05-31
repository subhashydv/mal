const readline = require('readline');
const { reader_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalSymbol, MalList, MalVector, MalNil, MalValue, } = require('./types');
const { Env } = require('./env');
const { coreMethod } = require('./core.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


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

const handleLet = (ast, env) => {
  const newEnv = new Env(env);
  const values = partitionBy(ast.value[1].value, 2);
  values.forEach(([key, value]) => {
    newEnv.set(key, eval(value, newEnv));
  })
  return eval(ast.value[2], newEnv);
}

const handleDo = (ast, env) => {
  let evaluatedExp = new MalNil();
  ast.forEach(expr => {
    evaluatedExp = eval(expr, env);
  })
  return evaluatedExp;
}

const handleIf = (ast, env) => {
  const condition = eval(ast[0], env);
  if (condition === false || condition instanceof MalNil) {
    if (ast[2] || ast[2] == false) {
      return eval(ast[2], env);
    }
    return new MalNil();
  }
  return eval(ast[1], env);
}

const handleFn = (ast, env) => {
  return (...arguments) => {
    const newEnv = new Env(env, ast.value[1].value, arguments);
    return eval(ast.value[2], newEnv);
  }
};

const eval = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);

  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], eval(ast.value[2], env));
      return env.get(ast.value[1]);
    case 'let*':
      handleLet(ast, env);
    case 'do':
      return handleDo(ast.value.slice(1), env);
    case 'if':
      return handleIf(ast.value.slice(1), env);
    case 'fn*':
      return handleFn(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const print = (malValue) => pr_str(malValue);

const env = new Env();
Object.keys(coreMethod).forEach(key =>
  env.set(new MalSymbol(key), coreMethod[key]));
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
