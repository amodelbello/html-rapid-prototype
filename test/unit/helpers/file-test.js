const shell = require('shelljs');
const fh = require('../../../helpers/file');
const assert = require('assert');
const sinon = require('sinon');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

describe('file', () => {
 
  describe('.fileExists(path)', () => {

    const fileThatExists = `exists.html`;
    const fileThatDoesNotExist = `does-not-exist.html`;

    const stubStatAsync = sinon.stub(fs, 'statAsync')
    stubStatAsync.withArgs(fileThatExists).resolves();
    stubStatAsync.withArgs(fileThatDoesNotExist).rejects();

    it('should confirm that a file exists', (done) => {

      fh.fileExists(fileThatExists)
        .then((exists) => {
          assert(exists === true);
          done();
        })
        .catch(e => {
          console.log(`Error ${e}`);
        });

    });

    it('should confirm that a file does not exist', (done) => {

      fh.fileExists(fileThatDoesNotExist)
        .then((exists) => {
          assert(exists === false);
          done();
        })
        .catch(e => {
          console.log(`Error ${e}`);
        });
    });
  });

  describe('.createDirectory(path)', () => {

    const directoryThatExists = `exists`;
    const directoryThatDoesNotExist = `does-not-exist`;

    const stubMkdirAsync = sinon.stub(fs, 'mkdirAsync')
    stubMkdirAsync.withArgs(directoryThatDoesNotExist).resolves();
    stubMkdirAsync.withArgs(directoryThatExists).rejects();

    it('should create a directory if one does not exist', (done) => {
      fh.createDirectory(directoryThatDoesNotExist)
      .then((success) => {
        assert(success === true);
        done();
      })
      .catch(e => {
        console.log(`Error ${e}`);
      });
    });

    it('should not create a directory if it already exists', (done) => {
      fh.createDirectory(directoryThatExists)
      .then((success) => {
        assert(success === false);
        done();
      })
      .catch(e => {
        console.log(`Error ${e}`);
      });
    });

  });
});