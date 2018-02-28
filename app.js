const fh = require('./lib/file_handling');
const cli = require('./lib/cli');


if (cli.arguments.init) {

  fh.generateBaseScaffold();
}



console.log("This is the beginning...");