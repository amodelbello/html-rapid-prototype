const fh = require('../helpers/file');
const bh = require('../helpers/build');
const config = require('../config/config');


exports.build = () => {
  fh.getDirectoryFiles(config.source_dir)
  .then((files) => {
    return new Promise((resolve, reject) => {
      fh.async(function*() {
        try {

          // Create dist/css/* here
          // Create dist/js/* here

          for (let file of files) {
            let content = yield bh.buildContent(file);
            console.log(content);
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

  .catch(e => {
    console.log(`Problem building: ${e}`);
  });
};