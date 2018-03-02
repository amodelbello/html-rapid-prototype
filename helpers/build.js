const fh = require('../helpers/file');
const config = require('../config/config');

function getFileNameFromVariableName(variableName) {
  let filename = variableName.replace('{{', '')
  .replace('}}', '')
  .trim();

  return filename;
}

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
          let filename = getFileNameFromVariableName(match);
          return contentObject.partials.get(`${config.source_dir}/${filename}`);
          break;
      }
      return content;
    }
    let content = contentObject.layoutFile.content.replace(config.patternVariable, onMatch)

    resolve(content);
  });
}

exports.buildContent = (file) => {
  return new Promise((resolve, reject) => {

    fh.async(function*() {
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
        reject(`Unable: ${e}`);
      }
    });
  });
};