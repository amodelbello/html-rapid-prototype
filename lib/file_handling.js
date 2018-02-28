const fs          = require('fs');
const boilerplate = require('./boilerplate_content');

const source_dir      = 'src';
const layouts_dir     = source_dir + '/layouts';
const partials_dir    = source_dir + '/partials';
const destination_dir = 'dist';

function fileExists(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) return reject(err);
      return resolve(stats);
    });
  });
}

function fileDoesNotExist(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) {
        return resolve();
      }
      return reject(`${path} already exists.`);
    });
  });
}

function createDirectory(path) {
  // console.log(`Creating ${path}`);
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) return reject(`Somthing went wrong creating ${path} directory: ${err}`);
      
      return resolve();
    });
  });
}

function createFile(path, content) {
  // console.log(`Creating ${path}`);
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) return reject(`Something went wrong creating ${path} file: ${err}`);
      return resolve();
    });
  });
}

function getFileContents(path) {
  // console.log(`Creating ${path}`);
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err || data == undefined) reject(err);

      console.log(data.toString());

      resolve(data.toString());
    });
  });
}

exports.generateBaseScaffold = () => {
  Promise.all([
    fileDoesNotExist('src'),
    fileDoesNotExist('dist'),
    fileDoesNotExist('config.json'),
  ])
  // create dirs and files
  .then(() => createFile(`config.json`, boilerplate.config))
  .then(() => createDirectory(source_dir))
  .then(() => createDirectory('src/layouts'))
  .then(() => createFile(`${layouts_dir}/_layout.html`, boilerplate.layout))
  .then(() => createDirectory(partials_dir))
  .then(() => createFile(`${partials_dir}/_header.html`, boilerplate.header))
  .then(() => createFile(`${partials_dir}/_footer.html`, boilerplate.footer))
  .then(() => createFile(`${source_dir}/index.html`, boilerplate.index))
  .then(() => createDirectory(destination_dir))
  .then(() => createFile(`${destination_dir}/index.html`, 
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
  .catch(error => {
    console.log(`Problem generating base scaffold: ${error}`);
  });
}

exports.getFileContents = () => {
  Promise.all([
    getFileContents('./file_one.txt'),
    getFileContents('./file_two.txt')
  ]).then(results => {
    const file_one_contents = results[0];
    const file_two_contents = results[1];

    console.log('Printing Results in order');
    console.log(file_one_contents)
    console.log(file_two_contents)

    console.log('finised');

  }).catch(error => {
    console.log(`Problem getting file contents: ${error}`);
  });
}