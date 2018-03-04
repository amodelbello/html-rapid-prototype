const cli = require('./helpers/cli');

exports.run = () => {
  if (cli.arguments.init) {
    const init_task = require('./tasks/init');
    init_task.createBaseScaffold()
    .catch(e => {
      console.log(`Could not initialize base scaffold: ${e}`);
    });
  }

  if (cli.arguments.build) {
    const build_task = require('./tasks/build');
    build_task.build()
    .catch(e => {
      console.log(`Unable to watch for changes: ${e}`);
    });
  }

  if (cli.arguments.generate) {
    const generate_task = require('./tasks/generate');
    const build_task = require('./tasks/build');

    generate_task.generateNewContentFiles()
    .then(() => build_task.build())
    .catch(e => {
      console.log(`Could not generate file(s): ${e}`);
    });
  }

  if (cli.arguments.watch) {
    const watch_task = require('./tasks/watch');
    const build_task = require('./tasks/build');

    build_task.build()
    .catch(e => {
      console.log(`Unable to watch for changes: ${e}`);
      console.log('Exiting...');
      process.exit(1);
    })
    .then(() => watch_task.watchForChanges());
  }
};