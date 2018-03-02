const logger = require('tracer').colorConsole();
const fs = require('fs');

exports.fileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) return reject(err);
      return resolve(stats);
    });
  });
}

exports.fileDoesNotExist = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) {
        return resolve();
      }
      return reject(`${path} already exists.`);
    });
  });
}

exports.createDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) return reject(`Somthing went wrong creating ${path} directory: ${err}`);
      
      return resolve();
    });
  });
}

exports.createFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) return reject(`Something went wrong creating ${path} file: ${err}`);
      return resolve();
    });
  });
}

exports.isFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(err);
      if (stats != undefined && stats.isFile()) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
}

exports.isDirectory = (path, data = '') => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(err);
      if (stats != undefined && stats.isDirectory()) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
}

exports.getDirectoryContents = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(`Something went wrong reading contents of ${path} directory: ${err}`);
      resolve(files);
    });
  });
}

// Get the contents of the files within a directory
exports.getDirectoryFilesContents = (path) => {
  return new Promise((resolve, reject) => {
    exports.getDirectoryFiles(path)
    .then((files) => {
      return new Promise((resolve, reject) => {
        let filesContents = new Map();
        exports.async(function*() {
          try {
            for (let file of files) {
              let content = yield exports.getFileContents(`${path}/${file}`);
              filesContents.set(`${path}/${file}`, content);
            }
            resolve(filesContents);
          }
          catch(error) {
            logger.error();
            reject(`Unable to get contents of files from ${path}: ${error}`);
          }
        });
      });
    })
    .then((filesContents) => {
      return resolve(filesContents);
    })
    .catch(e => {
      logger.error();
      reject(`Unable to get directory files contents from ${path}: ${e}`);
    });
  });
}

// TODO: study this, can it be simplified?
exports.getDirectoryFiles = (path) => {
  return new Promise((resolve, reject) => {
    exports.getDirectoryContents(path)
    .then((contents) => {
      return new Promise((resolve, reject) => {
        let files = [];
        exports.async(function*() {
          try {
            for (let file of contents) {
              let isFile = yield exports.isFile(`${path}/${file}`);
              if (isFile) {
                files.push(file);
              }
            }
            resolve(files);
          }
          catch(error) {
            logger.error();
            reject(`Unable to get files from ${path}: ${error}`);
          }
        });
      })
    })
    .then((files) => {
      return resolve(files);
    })
    .catch(e => {
      logger.error();
      reject(`Unable to get directory files from ${path}: ${e}`);
    });
  });
}

exports.getFileContents = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err || data == undefined) reject(err);
      resolve(data.toString());
    });
  });
}

exports.async = (generator) => {
  var iterator = generator();

  function handle(iteratorResult) {
    if (iteratorResult.done) {
      return;
    }

    const iteratorValue = iteratorResult.value;

    if (iteratorValue instanceof Promise) {
      iteratorValue
        .then(res => handle(iterator.next(res)))
        .catch(e => {
          logger.error();
          iterator.throw(e)
        });
    }
  }

  try {
    handle(iterator.next());
  }
  catch (e) { 
    logger.error();
    iterator.throw(e); 
  }
}
