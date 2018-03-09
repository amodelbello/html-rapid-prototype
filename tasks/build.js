const fh = require('../helpers/file');
const util = require('../helpers/util')
const config = require('../config/config');


function injectContent(contentObject) {
  return new Promise((resolve, reject) => {

    function onMatch(match) {
      let content = '';
      switch (match) {

        case '{{ __title__ }}':
          return contentObject.title;
          break;

        case '{{ __styles__ }}':
          for(let style of contentObject.stylesheets) {
            content += `
<link rel="stylesheet" href="${style}">`;
          }
          return content;
          break;

        case '{{ __main__ }}':
          return contentObject.contentFile.content;
          break;

        case '{{ __javascript__ }}':
          for(let script of contentObject.javascripts) {
            content += `
<script src="${script}"></script>`;
          }
          return content;
          break;

        default:
          let filename = util.getFileNameFromVariableName(match);
          return contentObject.partials.get(`${config.source_dir}/${filename}`);
          break;
      }
      return content;
    }
    let content = contentObject.layoutFile.content.replace(config.patternVariable, onMatch)

    resolve(content);
  });
}

function buildContent(file) {
  return new Promise((resolve, reject) => {

    util.async(function*() {
      try {

        let configContents = yield fh.getFileContents('config.json');
        let configObj = JSON.parse(configContents);
        let title = configObj.title;
        let stylesheetsArray = configObj.stylesheets;
        let javascriptsArray = configObj.javascripts;

        let contentObject = {
          title: configObj.title,
          contentFile: {
            name: `${config.source_dir}/${file}`,
            content: yield fh.getFileContents(`${config.source_dir}/${file}`)
          },
          layoutFile: {
            name: `${config.layouts_dir}/layout.html`,
            content: yield fh.getFileContents(`${config.layouts_dir}/layout.html`)
          },
          partials: yield fh.getDirectoryFilesContents(config.partials_dir),

          // FIXME: Change these to maps instead of arrays of objects
          stylesheets: configObj.stylesheets,
          javascripts: configObj.javascripts,
        }

        // Do the actual work
        let content = yield injectContent(contentObject);

        return resolve(content);
      }
      catch(e) {
        console.log(`Unable to build content: ${e}`);
      }
    });
  });
};

exports.build = () => {
  return fh.getDirectoryFiles(config.source_dir)
  .then((files) => {
    return new Promise((resolve, reject) => {
      util.async(function*() {
        try {

          console.log(`\nCopying css, js, and img files...`);
          yield fh.deleteDirectoryRecursive(config.destination_dir);
          yield fh.createDirectory(config.destination_dir);

          yield fh.copyDirectoryRecursive(`${config.source_dir}/css`, config.destination_dir);
          yield fh.copyDirectoryRecursive(`${config.source_dir}/js`, config.destination_dir);
          yield fh.copyDirectoryRecursive(`${config.source_dir}/img`, config.destination_dir);

          for (let file of files) {
            console.log(`Building ${config.destination_dir}/${file}`);
            let content = yield buildContent(file);
            yield fh.createFile(`${config.destination_dir}/${file}`, content);
          }

          console.log(`\nDone!`);

          return resolve();
        }
        catch(e) {
          return reject(`Unable to build file: ${e}`);
        }
      });

      return resolve();
    })
  })

  .catch(e => {
    let message = `Problem getting directory files: ${e}`;
    throw message;
  });
};