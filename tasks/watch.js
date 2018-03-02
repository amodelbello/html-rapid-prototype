const watch = require('node-watch');
const config = require('../config/config');
const build_task = require('./build');
 
// TODO: Handle when the user's cd is not root of project
const cwd = process.cwd();
console.log(`Watching for changes on ${cwd}/${config.source_dir}`);

watch(`${config.source_dir}`, { recursive: true }, function(evt, name) {
  build_task.build();
});