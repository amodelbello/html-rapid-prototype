const cli = require('./helpers/cli');
const init_task = require('./tasks/init');
const build_task = require('./tasks/build');
const generate_task = require('./tasks/generate');


if (cli.arguments.init) {
  init_task.generateBaseScaffold();
}

if (cli.arguments.build) {
  build_task.build();
}


console.log("This is the beginning...");