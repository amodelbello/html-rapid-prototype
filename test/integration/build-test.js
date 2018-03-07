const shell = require('shelljs');
const in_array = require('in_array');
const assert = require('assert');
const content = require('./content');

describe('build - Integration', () => {
 
  beforeEach(() => {
    shell.rm('-rf', 'test-site/*');
    shell.cd('test-site')
    shell.exec('../bin/run.js init', {silent:true}).stdout;
  });

  afterEach(() => {
    shell.cd('..')
  });

  describe('build', () => {

    it('run build and see correct output message and generated files', () => {
     

      let buildOutput = shell.exec('../bin/run.js build', {silent:true}).stdout;
      assert(buildOutput == content.correctBuildOutput, `Incorrect output: ${buildOutput}`);

      const lsTestSite = shell.ls();
      assert(in_array('dist', lsTestSite), 'dist directory does not exist.');

      const lsDist = shell.ls('dist');
      assert(in_array('css', lsDist), 'dist/css directory does not exist.');
      assert(in_array('img', lsDist), 'dist/img directory does not exist.');
      assert(in_array('js', lsDist), 'dist/js directory does not exist.');
      assert(in_array('index.html', lsDist), 'dist/index.html file does not exist.');

      const lsDistCss = shell.ls('dist/css');
      assert(in_array('style.css', lsDistCss), 'dist/css/style.css file does not exist.');

      const lsDistImg = shell.ls('dist/img');
      assert(in_array('test.jpg', lsDistImg), 'dist/img/test.jpg file does not exist.');

      const lsDistJs = shell.ls('dist/js');
      assert(in_array('script.js', lsDistJs), 'dist/js/script.js file does not exist.');

      // index.html
      const indexFileContent = shell.cat('dist/index.html').stdout;
      assert(indexFileContent == content.correctIndexFileContent, `dist/index.html has incorrect content: ${indexFileContent}`);
    });
  });
});