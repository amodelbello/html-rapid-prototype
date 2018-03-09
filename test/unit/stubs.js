const sinon = require('sinon');
var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

exports.fileThatExists = `exists.html`;
exports.fileThatDoesNotExist = `does-not-exist.html`;
exports.emptyDirectoryThatExists = `exists-empty`;
exports.directoryWithContents = `with-contents`;
exports.directoryWithOnlyFiles = `with-only-files`;
exports.directoryWithOnlyDirectories = `with-only-directories`;
exports.directoryThatDoesNotExist = `does-not-exist`;
exports.testContent = `This is some test content :)`;

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
statAsync.withArgs(`${exports.directoryWithContents}/${exports.fileThatExists}`).resolves(statsIsFile);
statAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithContents}`).resolves(statsIsDirectory);
statAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}`).resolves(statsIsDirectory);
statAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).resolves(statsIsFile);
statAsync.withArgs(`${exports.directoryWithOnlyFiles}`).resolves(statsIsDirectory);
statAsync.withArgs(`${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).resolves(statsIsFile);
statAsync.withArgs(`${exports.directoryWithOnlyDirectories}/${exports.directoryWithOnlyDirectories}`).resolves(statsIsDirectory);
statAsync.withArgs(`${exports.directoryWithOnlyDirectories}/${exports.directoryWithContents}`).resolves(statsIsDirectory);
statAsync.withArgs(`${exports.directoryWithOnlyDirectories}/${exports.directoryWithOnlyFiles}`).resolves(statsIsDirectory);
statAsync.withArgs(exports.emptyDirectoryThatExists).resolves(statsIsDirectory);
statAsync.withArgs(exports.fileThatDoesNotExist).rejects(undefined);
statAsync.withArgs(exports.directoryThatDoesNotExist).rejects(undefined);
statAsync.withArgs(`${exports.directoryThatDoesNotExist}/${exports.directoryWithOnlyFiles}`).rejects(undefined);
statAsync.withArgs(`${exports.directoryThatDoesNotExist}/${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).rejects(undefined);

const mkdirAsync = sinon.stub(fs, 'mkdirAsync')
mkdirAsync.withArgs(exports.directoryThatDoesNotExist).resolves();
mkdirAsync.withArgs(`${exports.directoryThatDoesNotExist}/${exports.directoryWithOnlyFiles}`).resolves();
mkdirAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}`).resolves();
mkdirAsync.withArgs(exports.emptyDirectoryThatExists).rejects();

const unlinkAsync = sinon.stub(fs, 'unlinkAsync');
unlinkAsync.withArgs(exports.fileThatExists).resolves();
unlinkAsync.withArgs(`${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).resolves();
unlinkAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).resolves();
unlinkAsync.withArgs(exports.fileThatDoesNotExist).rejects();

const rmdirAsync = sinon.stub(fs, 'rmdirAsync');
rmdirAsync.withArgs(exports.emptyDirectoryThatExists).resolves();
// We just deleted all of the below 2 directories' files. That's why it resolves. It's empty
rmdirAsync.withArgs(exports.directoryWithOnlyFiles).resolves();
rmdirAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}`).resolves();
rmdirAsync.withArgs(exports.directoryWithContents).rejects();
rmdirAsync.withArgs(exports.directoryThatDoesNotExist).rejects();
rmdirAsync.withArgs(exports.fileThatExists).rejects();

const readdirAsync = sinon.stub(fs, 'readdirAsync');
readdirAsync.withArgs(exports.directoryWithContents).resolves([]);
readdirAsync.withArgs(exports.directoryWithContents).resolves(
  [exports.fileThatExists, exports.directoryWithContents]
);
readdirAsync.withArgs(exports.directoryWithOnlyFiles).resolves(
  [exports.fileThatExists, exports.fileThatExists]
);
readdirAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}`).resolves(
  [exports.fileThatExists, exports.fileThatExists]
);
readdirAsync.withArgs(exports.directoryWithOnlyDirectories).resolves(
  [exports.directoryWithOnlyDirectories, exports.directoryWithContents, exports.directoryWithOnlyFiles]
);
readdirAsync.withArgs(exports.directoryWithContents + '2').resolves();
readdirAsync.withArgs(exports.emptyDirectoryThatExists).rejects();
readdirAsync.withArgs(exports.fileThatExists).rejects();
readdirAsync.withArgs(exports.directoryThatDoesNotExist).rejects();

const readFileAsync = sinon.stub(fs, 'readFileAsync');
readFileAsync.withArgs(`${exports.directoryWithContents}/${exports.fileThatExists}`).resolves(exports.testContent);
readFileAsync.withArgs(`${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`).resolves(exports.testContent);
readFileAsync.withArgs(`${exports.fileThatExists}`).resolves(exports.testContent);
readFileAsync.withArgs(exports.fileThatDoesNotExist).rejects();
readFileAsync.withArgs(exports.directoryWithContents).rejects();
readFileAsync.withArgs(exports.directoryThatDoesNotExist).rejects();

const writeFileAsync = sinon.stub(fs, 'writeFileAsync');
writeFileAsync.withArgs(exports.fileThatExists, exports.testContent).resolves();
writeFileAsync.withArgs(exports.fileThatDoesNotExist, exports.testContent).resolves();
writeFileAsync.withArgs(`${exports.directoryThatDoesNotExist}/${exports.directoryWithOnlyFiles}`, exports.testContent).resolves();
writeFileAsync.withArgs(`${exports.directoryThatDoesNotExist}/${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`, exports.testContent).resolves();
writeFileAsync.withArgs(`${exports.directoryWithContents}/${exports.directoryWithOnlyFiles}/${exports.fileThatExists}`, exports.testContent).resolves();
writeFileAsync.withArgs(exports.fileThatDoesNotExist, exports.testContent).resolves();
writeFileAsync.withArgs(exports.directoryWithContents, exports.testContent).rejects()
