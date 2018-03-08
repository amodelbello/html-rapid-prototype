const sinon = require('sinon');
var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

exports.fileThatExists = `exists.html`;
exports.fileThatDoesNotExist = `does-not-exist.html`;
exports.emptyDirectoryThatExists = `exists-empty`;
exports.directoryWithContents = `with-contents`;
exports.directoryThatDoesNotExist = `does-not-exist`;

const statAsync = sinon.stub(fs, 'statAsync')
let statsIsFile = {
  isFile: () => { return true; },
  isDirectory: () => { return false; }
};
let statsIsDirectory = {
  isFile: () => { return false; },
  isDirectory: () => { return true; }
};
statAsync.withArgs(exports.fileThatExists).resolves(statsIsFile);
statAsync.withArgs(exports.emptyDirectoryThatExists).resolves(statsIsDirectory);
statAsync.withArgs(exports.fileThatDoesNotExist).rejects(undefined);
statAsync.withArgs(exports.directoryThatDoesNotExist).rejects(undefined);
exports.statAsync = statAsync

const mkdirAsync = sinon.stub(fs, 'mkdirAsync')
mkdirAsync.withArgs(exports.directoryThatDoesNotExist).resolves();
mkdirAsync.withArgs(exports.emptyDirectoryThatExists).rejects();
exports.mkdirAsync = mkdirAsync

const writeFileAsync = sinon.stub(fs, 'writeFileAsync');
writeFileAsync.withArgs(exports.fileThatDoesNotExist).resolves();
writeFileAsync.withArgs(exports.fileThatExists).rejects();
exports.writeFileAsync = writeFileAsync

const unlinkAsync = sinon.stub(fs, 'unlinkAsync');
unlinkAsync.withArgs(exports.fileThatExists).resolves();
unlinkAsync.withArgs(exports.fileThatDoesNotExist).rejects();
exports.unlinkAsync = unlinkAsync

const rmdirAsync = sinon.stub(fs, 'rmdirAsync');
rmdirAsync.withArgs(exports.emptyDirectoryThatExists).resolves();
rmdirAsync.withArgs(exports.directoryWithContents).rejects();
rmdirAsync.withArgs(exports.directoryThatDoesNotExist).rejects();
exports.rmdirAsync = rmdirAsync
