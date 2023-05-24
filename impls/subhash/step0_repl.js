const { stdin, stdout } = require('process');

const read = (str) => str;

const eval = (ast) => ast;

const print = (str) => str;

const rep = (str) => print(eval(read(str)));

stdout.write("user> ");
stdin.on('data', (data) => {
  stdout.write(rep(data));
  stdout.write("user> ");
});
