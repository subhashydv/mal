const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const read = (str) => str;

const eval = (ast) => ast;

const print = (str) => str;

const rep = (str) => print(eval(read(str)));

const repl = () =>
  rl.question('user> ', line => {
    console.log(rep(line));
    repl();
  });

repl();
