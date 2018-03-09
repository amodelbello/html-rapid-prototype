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
      fh.createFile(stubs.fileThatDoesNotExist, stubs.testContent)
      .then((success) => {
        assert(success === true);
        done();
      })
      .catch(e => {
        console.log(`Should not be here: ${e}`);
      });
    });

    it('should not be able to create a file if it already exists', (done) => {
      fh.createFile(stubs.fileThatExists, stubs.testContent)
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

    // TODO: Add test:
    // it('should not be able to delete a directory', (done) => {
    // });

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

    it('should not delete a directory that does not exist', (done) => {
      fh.deleteDirectory(stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === false);
        done();
      });
    });

    // TODO: Add test:
    // it('should not be able to delete a file', (done) => {
    // });

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

  describe('.copyFile(from, to, force)', () => {
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

    it('should not copy a file that does not exist to any destination', (done) => {
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

  describe('.getDirectoryContents(path)', () => {
    it("should read the contents of a directory that's is not empty", (done) => {
      fh.getDirectoryContents(stubs.directoryWithContents)
      .then((files) => {
        assert(Array.isArray(files) === true, `returned data must be array`);
        assert(files.length > 0, `returned array should not be empty`);
        done();
      });
    });

    it("should return false when fs.readdirAysnc returns an empty array", (done) => {
      // for some reason fs.readdirAsync read the directory but returned no content
      fh.getDirectoryContents(stubs.directoryWithContents + '2')
      .then((files) => {
        assert(files === false, `fs.readdirAsync should have returned nothing`);
        done();
      });
    });

    it("should not be able to read the contents of an empty directory", (done) => {
      fh.getDirectoryContents(stubs.emptyDirectoryThatExists)
      .then((files) => {
        assert(files === false, `should not be getting contents back from an empty directory`);
        done();
      });
    });

    it("should not be able to read the contents of a file", (done) => {
      fh.getDirectoryContents(stubs.fileThatExists)
      .then((files) => {
        assert(files === false, `should not be getting contents back from a file`);
        done();
      });
    });

    it("should not be able to read a directory that does not exist", (done) => {
      fh.getDirectoryContents(stubs.directoryThatDoesNotExist)
      .then((files) => {
        assert(files === false, `should not be getting contents back from a directory that does not exist`);
        done();
      });
    });
  });

  describe('.getDirectoryFilesContents(path)', () => {
    it("should get the contents of the files in a directory", (done) => {
      fh.getDirectoryFilesContents(stubs.directoryWithContents)
      .then((contents) => {
        assert(contents instanceof Map, 'returned contents should be a Map');
        let test = contents.entries().next().value;
        for (let item of contents.values()) {
          assert(item != '', 'file content should not be empty');
        }
        done();
      });
    });

    it("should not get contents of files in an empty directory", (done) => {
      fh.getDirectoryFilesContents(stubs.emptyDirectoryThatExists)
      .then((contents) => {
        assert(contents instanceof Map, 'returned contents should be a Map');
        assert(contents.entries().next().value === undefined, 'should not return contents of an empty directory')
        done();
      });
    });

    it("should not get contents of a file", (done) => {
      fh.getDirectoryFilesContents(stubs.fileThatExists)
      .then((contents) => {
        assert(contents instanceof Map, 'returned contents should be a Map');
        assert(contents.entries().next().value === undefined, 'should not return contents of an empty directory')
        done();
      });
    });

    it("should not get contents of a directory that does not exist", (done) => {
      fh.getDirectoryFilesContents(stubs.directoryThatDoesNotExist)
      .then((contents) => {
        assert(contents instanceof Map, 'returned contents should be a Map');
        assert(contents.entries().next().value === undefined, 'should not return contents of an empty directory')
        done();
      });
    });
  });

  describe('.getDirectoryFiles(path)', () => {
    it("should get the files in a directory", (done) => {
      fh.getDirectoryFiles(stubs.directoryWithContents)
      .then((files) => {
        assert(Array.isArray(files) === true, `returned data must be array`);
        assert(files.length > 0, `returned array should not be empty`);
        done();
      });
    });

    it("should not get files from a directory with no files", (done) => {
      fh.getDirectoryFiles(stubs.directoryWithOnlyDirectories)
      .then((files) => {
        assert(Array.isArray(files) === true, `returned data must be array`);
        assert(files.length === 0, `returned array should be empty`);
        done();
      })
      .catch(e => {
        console.log(e);
      });
    });

    it("should not get files from a directory that does not exist", (done) => {
      fh.getDirectoryFiles(stubs.directoryThatDoesNotExist)
      .then((files) => {
        assert(Array.isArray(files) === true, `returned data must be array`);
        assert(files.length === 0, `returned array should be empty`);
        done();
      });
    });

    it("should not get files from a file", (done) => {
      fh.getDirectoryFiles(stubs.fileThatExists)
      .then((files) => {
        assert(Array.isArray(files) === true, `returned data must be array`);
        assert(files.length === 0, `returned array should be empty`);
        done();
      });
    });
  });

  describe(".getFileContents(path)", () => {
    it("should get the contents of a file", (done) => {
      fh.getFileContents(stubs.fileThatExists)
      .then((content) => {
        assert(content, "content should not be empty");
        assert(content != '', "content should not be an empty string");
        done();
      })
    });

    it("should not get the contents of a directory", (done) => {
      fh.getFileContents(stubs.directoryWithContents)
      .then((content) => {
        assert(content === false, 'should not be able to get file contents of a directory');
        done();
      })
    });

    it("should not get the contents of a file that does not exist", (done) => {
      fh.getFileContents(stubs.fileThatDoesNotExist)
      .then((content) => {
        assert(content === false, 'should not be able to get file contents of a directory');
        done();
      })
    });
  });

  describe(".writeToFile(path, content)", () => {
    it("should write to a file that already exists", (done) => {
      fh.writeToFile(stubs.fileThatExists, stubs.testContent)
      .then((success) => {
        assert(success === true, 'should have written to the file');
        done();
      })
    });

    it("should write to a file that does not exist", (done) => {
      fh.writeToFile(stubs.fileThatDoesNotExist, stubs.testContent)
      .then((success) => {
        assert(success === true, 'should have written to the file');
        done();
      })
    });

    it("should not be able to write to a directory", (done) => {
      fh.writeToFile(stubs.directoryWithContents, stubs.testContent)
      .then((success) => {
        assert(success === false, 'should not have written to the file');
        done();
      })
    });
  });

  // TODO: Test the recursion
  describe(".copyDirectoryRecursive(directoryPath, destination, force)", () => {
    it("should copy a directory of files to a destination that does not yet exist", (done) => {
      fh.copyDirectoryRecursive(stubs.directoryWithOnlyFiles, stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === true);
        done();
      })
      .catch(e => {
        console.log(`Error: ${e}`);
      });
    });

    it("should copy a directory of files to a destination that exists when forced", (done) => {
      fh.copyDirectoryRecursive(stubs.directoryWithOnlyFiles, stubs.directoryWithContents, true)
      .then((success) => {
        assert(success === true);
        done();
      })
      .catch(e => {
        console.log(`Error: ${e}`);
      });
    });

    it("should not copy a directory of files to a destination that exists when not forced", (done) => {
      fh.copyDirectoryRecursive(stubs.directoryWithOnlyFiles, stubs.directoryWithContents)
      .then((success) => {
        console.log('should not be here')
      })
      .catch(e => {
        done();
      });
    });
  });

  // TODO: Test the recursion
  describe('.deleteDirectoryRecursive(path)', () => {
    it("should delete a directory with files", (done) => {
      fh.deleteDirectoryRecursive(stubs.directoryWithOnlyFiles)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it("should delete an empty directory", (done) => {
      fh.deleteDirectoryRecursive(stubs.emptyDirectoryThatExists)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it("should not delete a directory that does not exist", (done) => {
      fh.deleteDirectoryRecursive(stubs.directoryThatDoesNotExist)
      .then((success) => {
        assert(success === true);
        done();
      });
    });

    it("should not delete a file", (done) => {
      fh.deleteDirectoryRecursive(stubs.fileThatExists)
      .then((success) => {
        console.log('should not be here');
      })
      .catch(e => {
        done();
      });
    });

  });
});