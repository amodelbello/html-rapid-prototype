const shell = require('shelljs');
const fh = require('../../../helpers/file');
const assert = require('assert');
var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const stubs = require('../stubs');

describe('helpers/file.js', () => {
 
  describe('.fileExists(path)', () => {

    it('should confirm that a file exists', (done) => {

      fh.fileExists(stubs.fileThatExists)
        .then((exists) => {
          assert(exists === true);
          done();
        });

    });

    it('should confirm that a file does not exist', (done) => {

      fh.fileExists(stubs.fileThatDoesNotExist)
        .then((exists) => {
          assert(exists === false);
          done();
        });
    });
  });

  describe('.createDirectory(path)', () => {

    it('should create a directory if one does not already exist', (done) => {
      fh.createDirectory(stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should not create a directory if it already exists', (done) => {
      fh.createDirectory(stubs.emptyDirectoryThatExists)
      .then((success) => {
        assert(success === false);
        done();
      });
    });
  });

  describe('.createFile(path)', () => {

    it('should create a file if one does not already exist', (done) => {
      fh.createFile(stubs.fileThatDoesNotExist, 'Some content :)')
      .then((success) => {
        assert(success === true);
        done();
      })
      .catch(e => {
        console.log(`Should not be here: ${e}`);
      });
    });

    it('should not be able to create a file if it already exists', (done) => {
      fh.createFile(stubs.fileThatExists, 'Some content :)')
      .then((success) => {
        console.log(`Should not be here: ${success}`);
      })
      .catch(e => {
        assert(e === `Could not create file. ${stubs.fileThatExists} already exists`)
        done();
      });
    });
  });

  describe('.deleteFile(path)', () => {

    it('should delete a file from the file system', (done) => {
      fh.deleteFile(stubs.fileThatExists)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should not be able to delete a file that does not exist', (done) => {
      fh.deleteFile(stubs.fileThatDoesNotExist)
      .then((success) => {
        assert(success === false);
        done();
      });
    });
  });

  describe('.deleteDirectory(path)', () => {
    it('should delete an empty directory that exists', (done) => {
      fh.deleteDirectory(stubs.emptyDirectoryThatExists)
      .then((success) => {
        assert(success === true);
        done();
      })
    });

    it('should not delete a directory that is not empty', (done) => {
      fh.deleteDirectory(stubs.directoryWithContents)
      .then((success) => {
        assert(success === false);
        done();
      })
    });

    it('should not delete adirectory that does not exist', (done) => {
      fh.deleteDirectory(stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === false);
        done();
      });
    });
  });

  describe('.isFile(path)', () => {
    it('should return true if path is a file', (done) => {
      fh.isFile(stubs.fileThatExists)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should return false if path is a directory', (done) => {
      fh.isFile(stubs.emptyDirectoryThatExists)
      .then((success) => {
        assert(success === false);
        done();
      });
    });

    it('should return false if path does not exist', (done) => {
      fh.isFile(stubs.fileThatDoesNotExist)
      .then((success) => {
        assert(success === false);
        done();
      });
    });
  });

  describe('.isDirectory(path)', () => {
    it('should return true if path is a directory', (done) => {
      fh.isDirectory(stubs.emptyDirectoryThatExists)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should return false if path is a file', (done) => {
      fh.isDirectory(stubs.fileThatExists)
      .then((success) => {
        assert(success === false);
        done();
      });
    });

    it('should return false if path does not exist', (done) => {
      fh.isFile(stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === false);
        done();
      });
    });
  });

  // yield exports.copyFile(`${directoryPath}/${item}`, `${destination}/${directory}/${item}`, true);
  describe('.copyFile(from, to, force', () => {
    it('should copy an existing file to a destination file that does not yet exist', (done) => {
      fh.copyFile(stubs.fileThatExists, stubs.fileThatDoesNotExist)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should copy an existing file to a destination file that already exists when forced', (done) => {
      fh.copyFile(stubs.fileThatExists, stubs.fileThatExists, true)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it('should not copy an existing file to a destination file that already exists when not forced', (done) => {
      fh.copyFile(stubs.fileThatExists, stubs.fileThatExists)
      .then((success) => {
        console.log(`Should not be here: ${success}`)
      })
      .catch(e => {
        // TODO: Figure out why e == "reject method is undefined"
        done();
      });
    });

    it('should not copy a file that doesn not exist to any destination', (done) => {
      fh.copyFile(stubs.fileThatDoesNotExist, stubs.fileThatExists)
      .then((success) => {
        console.log(`Should not be here: ${success}`)
      })
      .catch(e => {
        // TODO: Figure out why e == "reject method is undefined"
        done();
      });
    });

  });
});