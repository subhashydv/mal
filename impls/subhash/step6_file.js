const readline = require('readline');
const { reader_str } = require('./reader');
const { MalSymbol, MalList, MalVector, MalNil, MalString, MalValue, MalKeyword, MalFunction, prStr } = require('./types');
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

  if (ast instanceof MalString) {
    return ast.value;
  }

  if (ast instanceof MalKeyword) {
    return ast.value;
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
  const forms = ast.value.slice(2);
  const values = partitionBy(ast.value[1].value, 2);
  values.forEach(([key, value]) => {
    newEnv.set(key, eval(value, newEnv));
  })
  const doForms = new MalList([new MalSymbol('do'), ...forms]);
  return [doForms, newEnv];
}

const handleDo = (ast, env) => {
  ast.slice(0, -1).forEach(expr => {
    eval(expr, env);
  })
  return ast[ast.length - 1];
}

const handleIf = (ast, env) => {
  const [truthy, falsy] = ast.slice(1);
  const predicate = eval(ast[0], env);
  if (!predicate || predicate instanceof MalNil) {
    return falsy || falsy == false ? falsy : new MalNil();
  }
  return truthy;
}

// const handleFn = (ast, env) => {
//   const [binds, ...body] = ast.value.slice(1);
//   const doForms = new MalList([new MalSymbol('do'), ...body]);
//   return new MalFunction(doForms, binds, env);
// };

const handleFn = (ast, env) => {
  // const doForms = new MalList([new MalSymbol("do"), ...statements]);
  const [binds, ...body] = ast.value.slice(1);
  const doForms = new MalList([new MalSymbol('do'), ...body]);
  fn = (...expers) => {
    fnEnv = new Env(binds, expers, env);
    return eval(doForms, fnEnv);
  };
  return new MalFunction(doForms, binds, env, fn);
};

const eval = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);

    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case 'def!':
        env.set(ast.value[1], eval(ast.value[2], env));
        return env.get(ast.value[1]);
      case 'let*':
        [ast, env] = handleLet(ast, env);
        break;
      case 'do':
        ast = handleDo(ast.value.slice(1), env);
        break;
      case 'if':
        ast = handleIf(ast.value.slice(1), env);
        break;
      case 'fn*':
        ast = handleFn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          oldEnv = fn.env;
          env = new Env(oldEnv, fn.binds.value, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const print = (malValue) => prStr(malValue, true);

const getValue = (arg) => {
  if (arg instanceof MalValue) {
    return arg.pr_str();
  }
  return arg;
}

const rep = (str) => print(eval(read(str), env));

const env = new Env();

const createReplEnv = () => {
  coreMethod['not'] = (arg) =>
    rep(`((fn* [x] (if x false true)) ${getValue(arg)})`);
  rep('(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))');
  coreMethod['eval'] = (ast) => {
    return eval(ast, env);
  };
  Object.keys(coreMethod).forEach(key =>
    env.set(new MalSymbol(key), coreMethod[key]));
}

createReplEnv();

const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });

if (process.argv.length >= 3) {
  rep('(load-file "' + process.argv[2] + '" )');
  rl.close();
} else {
  repl();
}


