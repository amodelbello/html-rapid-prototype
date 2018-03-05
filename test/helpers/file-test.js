const fh = require('../../helpers/file');
const assert = require('assert');

describe('file', () => {
  describe('.fileExists(path)', () => {

    it('should confirm that a file exists', (done) => {
      const file = `test/test-assets/test-directory/test-file.html`
      fh.fileExists(file)
        .then((exists) => {
          assert(exists === true);
          done();
        });
    });

    it('should confirm that a file does not exist', (done) => {
      const file = `this/does/not/exist.html`;
      fh.fileExists(file)
        .then((exists) => {
          assert(exists === false);
          done();
        });
    });
  });
});