const boilerplate = require('./boilerplate_content');
const util        = require('./file_processing/utilities');

const config = {
  source_dir: 'src',
  layouts_dir: 'src/layouts',
  partials_dir: 'src/partials',
  destination_dir: 'dist',
};


function buildFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`Building: ${file}`);
    resolve();
  });
}

exports.config = config;

exports.build = () => {
  util.getDirectoryFiles(config.source_dir)
  .then((files) => {
    console.log(`Directory Files: ${files}`);
    return new Promise((resolve, reject) => {
        util.async(function*() {
          try {
            for (let file of files) {
              yield buildFile(file);
            }
          }
          catch(e) {
            reject(`Unable to build ${file}`);
          }
      });

      resolve({});

    });
  })

  // .then((data) => {
    // util.isDirectory('src/index.html', data);
  // })

  .catch(e => {
    console.log(`Problem building: ${e}`);
  });
};


exports.generateBaseScaffold = () => {
  Promise.all([
    util.fileDoesNotExist('src'),
    util.fileDoesNotExist('dist'),
    util.fileDoesNotExist('config.json'),
  ])
  // create directories and files
  .then(() => util.createFile(`config.json`, boilerplate.config))
  .then(() => util.createDirectory(config.source_dir))
  .then(() => util.createDirectory('src/layouts'))
  .then(() => util.createFile(`${config.layouts_dir}/layout.html`, boilerplate.layout))
  .then(() => util.createDirectory(config.partials_dir))
  .then(() => util.createFile(`${config.partials_dir}/header.html`, boilerplate.header))
  .then(() => util.createFile(`${config.partials_dir}/footer.html`, boilerplate.footer))
  .then(() => util.createFile(`${config.source_dir}/index.html`, boilerplate.index))
  .then(() => util.createDirectory(config.destination_dir))
  .then(() => util.createFile(`${config.destination_dir}/index.html`, 
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
