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
  // create directories and files
  .then(() => fh.createFile(`config.json`, boilerplate.config))
  .then(() => fh.createDirectory(config.source_dir))
  .then(() => fh.createDirectory('src/layouts'))
  .then(() => fh.createFile(`${config.layouts_dir}/layout.html`, boilerplate.layout))
  .then(() => fh.createDirectory(config.partials_dir))
  .then(() => fh.createFile(`${config.partials_dir}/header.html`, boilerplate.header))
  .then(() => fh.createFile(`${config.partials_dir}/footer.html`, boilerplate.footer))
  .then(() => fh.createFile(`${config.source_dir}/index.html`, boilerplate.index))
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
        _layout.html
      partials/
        _header.html
        _footer.html
    dist/
      index.html
    `);
  })
  .catch(e => {
    console.log(`Problem generating base scaffold: ${e}`);
  });
};
