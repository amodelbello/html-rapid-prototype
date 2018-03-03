const logger = require('tracer').colorConsole();
const cli = require('../helpers/cli');
const config = require('../config/config');
const fh = require('../helpers/file');
const util = require('../helpers/util')
const build_task = require('../tasks/build');

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

    util.async(function*() {
      try {
        let files = cli.filenames;
        for(let file of files) {
          let fileDoesNotExist = yield fh.fileDoesNotExist(`${config.source_dir}/${file}`);
          if (fileDoesNotExist) {
            yield generateContentFile(file);
          } else {
            return reject(`Could not generate. File: ${config.source_dir}/${file} already exists`);
          }
        }

        console.log(``);
        yield build_task.build();
      }
      catch(e) {
        logger.error();
        return reject(`Unable to generate content files: ${e}`);
      }
    });
  });
};