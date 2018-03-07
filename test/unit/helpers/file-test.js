const fh = require('../../../helpers/file');
const assert = require('assert');
const sinon = require('sinon');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

describe('file', () => {
  const stub = sinon.stub(fs, 'statAsync')
  stub.withArgs(`exists.html`).returns(Promise.resolve(true));
  stub.withArgs(`does-not-exist.html`).returns(Promise.reject());
 
  describe('.fileExists(path)', () => {

    it('should confirm that a file exists', (done) => {

      const file = `exists.html`;

      fh.fileExists(file)
        .then((exists) => {
          assert(exists === true);
          done();
        })
        .catch(e => {
          console.log(`Error ${e}`);
        });

    });

    it('should confirm that a file does not exist', (done) => {

      const file = `does-not-exist.html`;
      fh.fileExists(file)
        .then((exists) => {
          assert(exists === false);
          done();
        })
        .catch(e => {
          console.log(`Error ${e}`);
        });

    });
  });
});