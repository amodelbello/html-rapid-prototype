const util = require('../helpers/util')
const logger = require('tracer').colorConsole();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
// const fs = require('fs');


// FIXME: Using fs.stat() to check for the existence of a file before calling fs.open(), fs.readFile() or fs.writeFile() is not recommended. Instead, user code should open/read/write the file directly and handle the error raised if the file is not available.
exports.fileExists = (path) => {
  return fs.statAsync(path).then((stats) => {
    return true;
  })
  .catch(e => {
    return false;
  });
}

exports.createDirectory = (path) => {
  return fs.mkdirAsync(path).then(() => {
    return true;
  })
  .catch(e => {
    return false;
  });
}

// TODO: this looks pretty much like a duplicate of exports.writeToFile
exports.createFile = (path, content) => {

  return exports.fileExists(path)
  .then((exists) => { 
    if (!exists) {
      return fs.writeFileAsync(path, content).then(() => {
        return true;
      })
      .catch(e => {
        return false;
      });
    } else {
      throw `Could not create file. ${path} already exists`;
    }
  });

}

exports.deleteFile = (path) => {
  return fs.unlinkAsync(path)
  .then(() => {
    return true;
  })
  .catch(e => {
    return false;
  });
}

exports.deleteDirectory = (path) => {
  return fs.rmdirAsync(path)
  .then(() => {
    return true;
  })
  .catch(e => {
    return false;
  });
}

exports.isFile = (path) => {
  return fs.statAsync(path)
  .then((stats) => {
    if (stats != undefined && stats.isFile()) {
      return true;
    } else {
      return false;
    }
  })
  .catch(e => {
    return false;
  });
}

exports.isDirectory = (path) => {
  return fs.statAsync(path)
  .then((stats) => {
    if (stats != undefined && stats.isDirectory()) {
      return true;
    } else {
      return false;
    }
  })
  .catch(e => {
    return false;
  });
}

exports.copyFile = (from, to, force = false) => {
  return new Promise((resolve, reject) => {
    util.async(function*() {
      try {
        let fromFileExists = yield exports.isFile(from);
        let toFileExists = yield exports.isFile(to);
        if (fromFileExists) {
          let content = yield exports.getFileContents(from);
          if (toFileExists) {
            if (!force) {
              throw `Destination file ${to} already exists.`;
            }
          }
          yield exports.writeToFile(to, content);
          return resolve(true);
        } else {
          throw `Cannot copy from ${from} because it does not exist.`;
        }
      }
      catch(e) {
        return reject(`Could not copy file: ${e}`);
      }
    });
  })
  .catch(e => {
    reject(e);
  });
}


exports.getDirectoryContents = (path) => {
  return fs.readdirAsync(path)
  .then((files) => {
    if (files) {
      return files;
    } else {
      return false;
    }
  })
  .catch(e => {
    return false;
  });
}

// Get the contents of the files within a directory
exports.getDirectoryFilesContents = (path) => {
  return new Promise((resolve, reject) => {
    exports.getDirectoryFiles(path)
    .then((files) => {
      return new Promise((resolve, reject) => {
        let filesContents = new Map();
        util.async(function*() {
          try {
            for (let file of files) {
              let content = yield exports.getFileContents(`${path}/${file}`);
              filesContents.set(`${path}/${file}`, content);
            }
            resolve(filesContents);
          }
          catch(e) {
            reject(`Unable to get contents of files from ${path}: ${e}`);
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

exports.getDirectoryFiles = (path) => {
  return new Promise((resolve, reject) => {
    exports.getDirectoryContents(path)
    .then((contents) => {
      return new Promise((resolve, reject) => {
        let files = [];
        util.async(function*() {
          try {
            if (contents !== false) {
              for (let file of contents) {
                let isFile = yield exports.isFile(`${path}/${file}`);
                if (isFile) {
                  files.push(file);
                }
              }
            }
            resolve(files);
          }
          catch(error) {
            reject(`Unable to get files from ${path}: ${error}`);
          }
        });
      })
    })
    .then((files) => {
      return resolve(files);
    })
    .catch(e => {
      reject(`${e}`);
    });
  });
}

exports.getFileContents = (path) => {
    return fs.readFileAsync(path)
    .then((data) => {
      return data.toString();
    })
    .catch(e => {
      return false;
    });
}

exports.writeToFile = (path, content) => {
  return fs.writeFileAsync(path, content)
  .then(() => {
    return true;
  })
  .catch(e => {
    return false;
  });

}

exports.copyDirectoryRecursive = (directoryPath, destination, force = false) => {
  return new Promise((resolve, reject) => {
    util.async(function*() {
      try {
        let directory = directoryPath.split('/').pop();
        let destinationExists = yield exports.fileExists(`${destination}/${directory}`);
        if (destinationExists) {
          if (!force) {
            reject(`Destination directory ${destination}/${directory} already exists`)
          }
          yield exports.deleteDirectoryRecursive(`${destination}/${directory}`);
        }

        yield exports.createDirectory(`${destination}/${directory}`);

        let contents = yield exports.getDirectoryContents(directoryPath);
        for (let item of contents) {
          let isFile = yield exports.isFile(`${directoryPath}/${item}`);
          if (isFile) {
            yield exports.copyFile(`${directoryPath}/${item}`, `${destination}/${directory}/${item}`, true);
          } else {
            yield exports.copyDirectoryRecursive(`${directoryPath}/${item}`, `${destination}/${directory}`);
          }
        }

        return resolve(true);
      }
      catch(e) {
        return reject();
      }
    });
  });
};

exports.deleteDirectoryRecursive = (path) => {
  return new Promise((resolve, reject) => {
    util.async(function*() {
      try {
        let exists = yield exports.fileExists(path);
        if (!exists) {
          return resolve(true);
        }
        let isDirectory = yield exports.isDirectory(path);
        if (!isDirectory) {
          return reject();
        }
        let contents = yield exports.getDirectoryContents(path);
        if(Array.isArray(contents)) {
          for (let item of contents) {
            let isFile = yield exports.isFile(`${path}/${item}`);
            if (isFile) {
              yield exports.deleteFile(`${path}/${item}`);
            } else {
              let directoryContents = yield exports.getDirectoryContents(`${path}/${item}`);
              if (!directoryContents.length) {
                yield exports.deleteDirectory(`${path}/${item}`);
              } else {
                yield exports.deleteDirectoryRecursive(`${path}/${item}`);
              }
            }
          }
        }

        yield exports.deleteDirectory(`${path}`);

        return resolve(true);
      }
      catch(e) {
        return reject(`Unable to recursively delete contents of directory ${path}: ${e}`);
      }
    });
  });
};