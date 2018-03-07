const logger = require('tracer').colorConsole();
const cli = require('../helpers/cli');
const config = require('../config/config');
const fh = require('../helpers/file');
const util = require('../helpers/util')

function generateContentFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`Generating ${config.source_dir}/${file}`);
    fh.createFile(`${config.source_dir}/${file}`, `<main>This is <em>${config.source_dir}/${file}</em></main>`)
    .then(() => {
      resolve();
    })
  });
}

exports.generateNewContentFiles = () => {
  return new Promise((resolve, reject) => {

    let files = cli.filenames;
    let error = '';
    util.async(function*() {

      try {
        console.log(``);
        for(let file of files) {

          let fileExists = yield fh.fileExists(`${config.source_dir}/${file}`);

          if (!fileExists) {
            yield generateContentFile(file);
          } else {
            error += `\n${config.source_dir}/${file} already exists`;
          }
        }
        if (error !== '') {
          return reject(error);
        } else {
          return resolve();
        }
      }
      catch(e) {
        throw e;
      }
    });
  });
};