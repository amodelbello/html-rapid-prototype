const usage = require('../config/boilerplate_content').usage;
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

if (input[0] !== 'generate' && input[0] !== 'init' && input.length !== 1) {
  error = true;
}

if (error) {
  console.log(usage);
  process.exit(1);
}

// generate (or init) command called - get file names to generate
let filenames = [];
if (!error && (input[0] === 'generate' || input[0] === 'init') && input.length !== 1) {
  for (let x = 1; x < input.length; x++) {
    filenames.push(input[x]);
  }
} else if (input[0] === 'init' && input.length === 1) {
  // init called with no filenames specified. Add default index.html
  if (!filenames.length) {
    filenames.push('index.html');
  }
}

const args = {
  init: (input[0] == 'init'),
  build: (input[0] == 'build'),
  watch: (input[0] == 'watch'),
  generate: (input[0] == 'generate'),
  file: (input[1] || false),
}

exports.arguments = args;
exports.filenames = filenames;