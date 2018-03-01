const cli = require('./lib/cli');
const fp = require('./lib/file_processing');


if (cli.arguments.init) {
  fp.generateBaseScaffold();
}

if (cli.arguments.build) {
  fp.build();
}


console.log("This is the beginning...");