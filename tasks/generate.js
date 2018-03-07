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
    for(let file of files) {
      fh.fileExists(`${config.source_dir}/${file}`)
      .then((exists) => {
        if(!exists) {
          generateContentFile(file);

        } else {
          console.log(`Could not generate ${config.source_dir}/${file} because it already exists`);
        }
      })
      .catch(e => {
        throw e;
      });
    }

    return resolve();

  });
};