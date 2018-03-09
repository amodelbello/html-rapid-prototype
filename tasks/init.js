const boilerplate = require('../config/boilerplate_content');
const config = require('../config/config');
const fh = require('../helpers/file');
const build_task = require('../tasks/build');
const generate_task = require('../tasks/generate');


exports.createBaseScaffold = () => {
  return Promise.all([
    // TODO: Probably better to just ensure current directory is empty
    fh.fileExists('src'),
    fh.fileExists('dist'),
    fh.fileExists('config.json'),
  ])
  .then((values) => {
    for (let exists of values) {
      if (exists === true) {
        throw Error("Make sure src/, dist/, and config.json do not exist in current directory.");
      }
    }
    // resolve();
  })

  .then(() => {

    // TODO: Make this actually read directory contents recursively and output that
    console.log(`\nInitializing new project...`);
    console.log(`Generating basic scaffold`);
  })

  // Create directories and files
  .then(() => fh.createFile(`config.json`, boilerplate.config))
  .then(() => fh.createDirectory(config.source_dir))

  // Create layout file
  .then(() => fh.createDirectory(config.layouts_dir))
  .then(() => fh.createFile(`${config.layouts_dir}/layout.html`, boilerplate.layout))

  // Create partial files
  .then(() => fh.createDirectory(config.partials_dir))
  .then(() => fh.createFile(`${config.partials_dir}/header.html`, boilerplate.header))
  .then(() => fh.createFile(`${config.partials_dir}/footer.html`, boilerplate.footer))

  .then(() => generate_task.generateNewContentFiles())

  // Create css, js, and img files
  .then(() => fh.createDirectory(`${config.source_dir}/css`))
  .then(() => fh.createFile(`${config.source_dir}/css/style.css`, ''))
  .then(() => fh.createDirectory(`${config.source_dir}/js`))
  .then(() => fh.createFile(`${config.source_dir}/js/script.js`, ''))
  .then(() => fh.createDirectory(`${config.source_dir}/img`))
  .then(() => fh.copyFile(`${__dirname}/../config/test.jpg`, `${config.source_dir}/img/test.jpg`))

  // Build files
  .then(() => {
    build_task.build();
  })
  .catch(e => {
    console.log(`Problem generating base scaffold: ${e}`);
  });
};
