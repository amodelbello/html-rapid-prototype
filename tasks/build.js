const logger = require('tracer').colorConsole();
const fh = require('../helpers/file');
const bh = require('../helpers/build');
const config = require('../config/config');


exports.build = () => {
  fh.getDirectoryFiles(config.source_dir)
  .then((files) => {
    return new Promise((resolve, reject) => {
      fh.async(function*() {
        try {

          console.log(`Copying css and js files...`);
          yield fh.deleteDirectoryRecursive(config.destination_dir);
          yield fh.createDirectory(config.destination_dir);

          yield fh.copyDirectoryRecursive(`${config.source_dir}/css`, config.destination_dir);
          yield fh.copyDirectoryRecursive(`${config.source_dir}/js`, config.destination_dir);

          for (let file of files) {
            console.log(`Building ${file}`);
            let content = yield bh.buildContent(file);
            yield fh.createFile(`${config.destination_dir}/${file}`, content);
          }

          console.log(`Done!`);
        }
        catch(e) {
          logger.error();
          reject(`Unable to build ${file}`);
        }
      });

      resolve();

    });
  })

  .catch(e => {
    logger.error();
    console.log(`Problem building: ${e}`);
  });
};