const logger = require('tracer').colorConsole();
const boilerplate = require('../config/boilerplate_content');
const config = require('../config/config');
const fh = require('../helpers/file');
const build = require('./build');


exports.generateBaseScaffold = () => {
  Promise.all([
    fh.fileDoesNotExist('src'),
    fh.fileDoesNotExist('dist'),
    fh.fileDoesNotExist('config.json'),
  ])
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
  .then(() => fh.createFile(`${config.source_dir}/index.html`, boilerplate.index))

  // Create css and js files
  .then(() => fh.createDirectory(`${config.source_dir}/css`))
  .then(() => fh.createFile(`${config.source_dir}/css/style.css`, ''))
  .then(() => fh.createDirectory(`${config.source_dir}/js`))
  .then(() => fh.createFile(`${config.source_dir}/js/script.js`, ''))

  // TODO: Run the build task here
  .then(() => fh.createDirectory(config.destination_dir))
  .then(() => fh.createFile(`${config.destination_dir}/index.html`, 
    boilerplate.layout +
    boilerplate.header +
    boilerplate.footer +
    boilerplate.index
  ))
  .then(() => {
    console.log(`
    Generated basic scaffold:
    config.json
    src/
      index.html
      layouts/
        layout.html
      partials/
        header.html
        footer.html
      css/
        style.css
      js/
        script.css
    dist/
      index.html
    `);
  })
  .catch(e => {
    logger.error();
    console.log(`Problem generating base scaffold: ${e}`);
  });
};
