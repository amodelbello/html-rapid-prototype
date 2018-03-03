const cli = require('./helpers/cli');

if (cli.arguments.init) {
  const init_task = require('./tasks/init');
  init_task.generateBaseScaffold();
}

if (cli.arguments.build) {
  const build_task = require('./tasks/build');
  build_task.build();
}

if (cli.arguments.generate) {
  const generate_task = require('./tasks/generate');
  // build_task.build();
}

if (cli.arguments.watch) {
  const watch_task = require('./tasks/watch');
}