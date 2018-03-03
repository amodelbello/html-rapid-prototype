const yargs = require('yargs')
const argv = yargs
  .usage('Usage: html-rapid-prototype <command> [options]')
  .command('init', 'Create basic scaffold')
  .command('build', 'Build static html files')
  .command('generate <file>...', 'Generate new content source file(s)')
  .command('watch', 'Trigger build on all changes to source directory')
  .version()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .epilogue('GitHub repository: https://github.com/amodelbello/html-rapid-prototype')
  .argv;

let error = false;
let input = argv._;

if (input.length === 0 || input.length > 2) {
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

if (input[0] === 'generate' && input.length !== 2) {
  error = true;
}

if (input[0] !== 'generate' && input.length !== 1) {
  error = true;
}

if (error) {
  yargs.showHelp();
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