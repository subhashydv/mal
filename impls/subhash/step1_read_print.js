const readline = require('readline');
const { reader_str } = require('./reader');
const { pr_str } = require('./printer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const read = (str) => reader_str(str);
const eval = (ast) => ast;
const print = (malValue) => pr_str(malValue);

const rep = (str) => print(eval(read(str)));

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
