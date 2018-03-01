const fp = require('./file_processing');

const contents = fp.getDirectoryContents(fp.config.source_dir);
console.log(contents);

exports.contents = contents;