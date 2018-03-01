const fh = require('../helpers/file');
const bh = require('../helpers/build');
const config = require('../config/config').config;


function buildFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`Building: ${file}`);
    bh.buildFile(file)
    .then(() => {
      return resolve();
    })
    .catch(e => {
      console.log(`Problem building file: ${e}`);
    });
  });
}

exports.build = () => {
  fh.getDirectoryFiles(config.source_dir)
  .then((files) => {
    console.log(`Directory Files: ${files}`);
    return new Promise((resolve, reject) => {
        fh.async(function*() {
          try {
            for (let file of files) {
              yield buildFile(file);
            }
            console.log(`We're all built!`);
          }
          catch(e) {
            reject(`Unable to build ${file}`);
          }
      });

      resolve({});

    });
  })

  // .then((data) => {
    // fh.isDirectory('src/index.html', data);
  // })

  .catch(e => {
    console.log(`Problem building: ${e}`);
  });
};