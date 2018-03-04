const usage = require('../config/boilerplate_content').usage;
const argv = require('yargs')
  .help(false)
  .alias('v', 'version')
  .argv;

let input = argv._;

function error() {
  console.log(usage);
  process.exit(1)  
}

const args = {
  init: false,
  build: false,
  watch: false,
  generate: false,
}
let filenames = [];


// No commands - error
if (input.length === 0) {
  error();
}

// Parse commands
switch(input[0]) {

  case 'build':
  case 'b':
    args.build = true;
    if (input.length !== 1) {
      error();
    }
    break;

  case 'watch':
  case 'w':
    args.watch = true;
    if (input.length !== 1) {
      error();
    }
    break;

  case 'generate':
  case 'g':
    args.generate = true;
    if (input.length < 2) {
      error();
    }
    for (let x = 1; x < input.length; x++) {
      filenames.push(input[x]);
    }
    break;

  case 'init':
  case 'i':
    args.init = true;
    if (input.length === 1) {
      filenames.push('index.html');
    } else {
      for (let x = 1; x < input.length; x++) {
        filenames.push(input[x]);
      }
    }
    break;

  default:
    error();
    break;
}

exports.arguments = args;
exports.filenames = filenames;