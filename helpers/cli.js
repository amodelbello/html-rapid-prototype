const argv = require('yargs')
  .help(false)
  .alias('v', 'version')
  .argv;

let error = false;
let input = argv._;

if (input.length === 0) {
  error = true;
}

if (
  input[0] !== 'init' &&
  input[0] !== 'build' &&
  input[0] !== 'generate' &&
  input[0] !== 'watch'
) {
  error = true;
}

if (input[0] === 'generate' && input.length < 2) {
  error = true;
}

if (input[0] !== 'generate' && input.length !== 1) {
  error = true;
}

if (error) {
  // TODO: Write real usage output
  console.log('ERROR!');
  process.exit(1);
}

const args = {
  init: (input[0] == 'init'),
  build: (input[0] == 'build'),
  watch: (input[0] == 'watch'),
  generate: (input[0] == 'generate'),
  file: (input[1] || false),
}

exports.arguments = args;