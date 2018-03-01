const pattern_partial = /{{[ ]*[\w\-.]+[ ]*}}/g;
const pattern_variable = /{{[ ]*__[\w\-.]+__[ ]*}}/g;

exports.buildFile = (file) => {
  return new Promise((resolve, reject) => {
    console.log(`exports.buildFile: ${file}`);
    return resolve(file);
    // return test;
    // return reject(`${file} FAILED`);
  });
};