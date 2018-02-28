const in_array = require('in_array');
const argv = require('yargs').argv;

const arguments = {
  'init': in_array('init', argv._),
  'generate': in_array('generate', argv._),
}

exports.argv = argv;
exports.arguments = arguments;