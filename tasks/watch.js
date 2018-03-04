const watch = require('node-watch');
const config = require('../config/config');
const build_task = require('./build');
 
exports.watchForChanges = () => {
  // TODO: Handle when the user's cwd is not root of project
  const cwd = process.cwd();
  console.log(`\nWatching for changes on ${cwd}/${config.source_dir}`);

  // FIXME: this filter does not work. It'll watch on .hidden files and I don't want it to, causes error on initial watch if there are hidden files, builds twice.
  watch(`${config.source_dir}`, { recursive: true, filter: /(?!\.swp)/ }, function(evt, name) {
    build_task.build()
    .catch(e => {
      console.log(`Unable to build while watching for changes: ${e}`);
      console.log('Exiting...');
      process.exit(1);
    })
  });
}