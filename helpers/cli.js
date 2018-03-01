const in_array = require('in_array');
const argv = require('yargs').argv;

const args = {
  'init': in_array('init', argv._),
  'build': in_array('build', argv._),
  'generate': in_array('generate', argv._),
}

exports.argv = argv;
exports.arguments = args;