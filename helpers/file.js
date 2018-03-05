const util = require('../helpers/util')
const logger = require('tracer').colorConsole();
const fs = require('fs');

exports.fileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) return resolve(false);
      return resolve(true);
    });
  });
}

// FIXME: Figure out a better way to return. bool? resolve()? what...
// Do we even need this function?
exports.fileDoesNotExist = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err || stats == undefined) {
        return resolve(true);
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

exports.deleteFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) return reject(`Something went wrong deleting file: ${path}: ${err}`);
      return resolve();
    });
  });
}

exports.deleteDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, (err) => {
      if (err) return reject(`Something went wrong deleting directory: ${path}: ${err}`);
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

exports.copyFile = (from, to) => {
  let read = fs.createReadStream(from);
  let write = fs.createWriteStream(to);
  return new Promise(function(resolve, reject) {
    read.on('error', reject);
    write.on('error', reject);
    write.on('finish', resolve);
    read.pipe(write);
  }).catch((e) => {
    read.destroy();
    write.end();
    logger.error();
    reject(`Could not copy file: ${e}`);
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
        util.async(function*() {
          try {
            for (let file of files) {
              let content = yield exports.getFileContents(`${path}/${file}`);
              filesContents.set(`${path}/${file}`, content);
            }
            resolve(filesContents);
          }
          catch(e) {
            logger.error();
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

// TODO: study this, can it be simplified?
exports.getDirectoryFiles = (path) => {
  return new Promise((resolve, reject) => {
    exports.getDirectoryContents(path)
    .then((contents) => {
      return new Promise((resolve, reject) => {
        let files = [];
        util.async(function*() {
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

exports.copyDirectoryRecursive = (directoryPath, destination, force = false) => {
  return new Promise((resolve, reject) => {
    util.async(function*() {
      try {
        let directory = directoryPath.split('/').pop();
        let destinationExists = yield exports.fileExists(`${destination}/${directory}`);
        if (destinationExists) {
          if (!force) {
            reject("Destination directory already exists!")
          }
          yield exports.deleteDirectoryRecursive(to);
        }

        yield exports.createDirectory(`${destination}/${directory}`);

        let contents = yield exports.getDirectoryContents(directoryPath);
        for (let item of contents) {
          let isFile = yield exports.isFile(`${directoryPath}/${item}`);
          if (isFile) {
            yield exports.createFile(`${destination}/${directory}/${item}`);
            yield exports.copyFile(`${directoryPath}/${item}`, `${destination}/${directory}/${item}`);
          } else {
            yield exports.copyDirectoryRecursive(`${directoryPath}/${item}`, `${destination}/${directory}`);
          }
        }

        return resolve();
      }
      catch(e) {
        logger.error();
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
          return resolve();
        }
        let contents = yield exports.getDirectoryContents(path);
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
        yield exports.deleteDirectory(`${path}`);

        return resolve();
      }
      catch(e) {
        return reject(`Unable to recursively delete contents of directory ${path}: ${e}`);
      }
    });
  });
};