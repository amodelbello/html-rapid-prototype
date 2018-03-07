const shell = require('shelljs');
const in_array = require('in_array');
const assert = require('assert');
const content = require('./content');
const boilerplate_content = require('../../config/boilerplate_content');
const stringSimilarity = require('string-similarity');
 

describe('generate - Integration', () => {
 
  beforeEach(() => {
    shell.rm('-rf', 'test-site/*');
    shell.cd('test-site')
    shell.exec('../bin/run.js init', {silent:true}).stdout;
  });

  afterEach(() => {
    shell.cd('..')
  });

  describe('run generate and see correct output message and generated files', () => {

    it('generate with one file specified', () => {
     
      let output = shell.exec('../bin/run.js generate file1.html', {silent:true}).stdout;
      const similarity = stringSimilarity.compareTwoStrings(output, content.correctGenerateFileOutput1);
      assert(similarity > content.stringSimilarityThreshold, `Unacceptable output similarity: ${similarity}`);

      const lsDist = shell.ls('dist');
      assert(in_array('file1.html', lsDist), 'dist/file1.html file does not exist.');

    });

    it('generate with two files specified', () => {
     
      let output = shell.exec('../bin/run.js generate file2.html file3.html', {silent:true}).stdout;
      const similarity = stringSimilarity.compareTwoStrings(output, content.correctGenerateFileOutput2);
      assert(similarity > content.stringSimilarityThreshold, `Unacceptable output similarity: ${similarity}`);

      const lsDist = shell.ls('dist');
      assert(in_array('file2.html', lsDist), 'dist/file2.html file does not exist.');
      assert(in_array('file3.html', lsDist), 'dist/file3.html file does not exist.');

    });

    it('generate with no files specified', () => {
     
      let output = shell.exec('../bin/run.js generate', {silent:true}).stdout;
      const similarity = stringSimilarity.compareTwoStrings(output, boilerplate_content.usage);
      assert(similarity > content.stringSimilarityThreshold, `Unacceptable output similarity: ${similarity}`);

    });

    it('generate with existing file specified', () => {

      // generate a file
      shell.exec('../bin/run.js generate file4.html', {silent:true}).stdout;

      // try to generate it again
      let output = shell.exec('../bin/run.js generate file4.html', {silent:true}).stdout;

      const similarity = stringSimilarity.compareTwoStrings(output, content.correctGenerateFileOutput3);
      assert(similarity > content.stringSimilarityThreshold, `Unacceptable output similarity: ${similarity}`);
    });
  });
});