// const shell = require('shelljs');
// const in_array = require('in_array');
// const assert = require('assert');
// const content = require('./content');

// describe('init', () => {
 
//   beforeEach(() => {
//     shell.rm('-rf', 'test-site/*');
//     shell.cd('test-site')
//   });

//   describe('init with no files specified', () => {

//     it('run init and see correct output message and generated files', () => {
     
//       let initOutput = shell.exec('../bin/run.js init', {silent:true}).stdout;
//       assert(initOutput == content.correctOutput, `Incorrect output: ${initOutput}`);

//       // project root
//       const lsTestSite = shell.ls();
//       assert(in_array('src', lsTestSite), 'src directory does not exist.');
//       assert(in_array('dist', lsTestSite), 'dist directory does not exist.');
//       assert(in_array('config.json', lsTestSite), 'config.json file does not exist.');

//       // src directory
//       const lsSrc = shell.ls('src');
//       assert(in_array('css', lsSrc), 'src/css directory does not exist.');
//       assert(in_array('img', lsSrc), 'src/img directory does not exist.');
//       assert(in_array('js', lsSrc), 'src/js directory does not exist.');
//       assert(in_array('layouts', lsSrc), 'src/layouts directory does not exist.');
//       assert(in_array('partials', lsSrc), 'src/partials directory does not exist.');
//       assert(in_array('index.html', lsSrc), 'src/index.html file does not exist.');

//       const lsSrcCss = shell.ls('src/css');
//       assert(in_array('style.css', lsSrcCss), 'src/css/style.css file does not exist.');

//       const lsSrcImg = shell.ls('src/img');
//       assert(in_array('test.jpg', lsSrcImg), 'src/img/test.jpg file does not exist.');

//       const lsSrcJs = shell.ls('src/js');
//       assert(in_array('script.js', lsSrcJs), 'src/js/script.js file does not exist.');

//       const lsSrcLayouts = shell.ls('src/layouts');
//       assert(in_array('layout.html', lsSrcLayouts), 'src/layouts/layout.html file does not exist.');

//       const lsSrcPartials = shell.ls('src/partials');
//       assert(in_array('header.html', lsSrcPartials), 'src/partials/header.html file does not exist.');
//       assert(in_array('footer.html', lsSrcPartials), 'src/partials/footer.html file does not exist.');

//       // dist directory
//       const lsDist = shell.ls('dist');
//       assert(in_array('css', lsSrc), 'dist/css directory does not exist.');
//       assert(in_array('img', lsSrc), 'dist/img directory does not exist.');
//       assert(in_array('js', lsSrc), 'dist/js directory does not exist.');
//       assert(in_array('index.html', lsSrc), 'dist/index.html file does not exist.');

//       const lsDistCss = shell.ls('dist/css');
//       assert(in_array('style.css', lsDistCss), 'dist/css/style.css file does not exist.');

//       const lsDistImg = shell.ls('dist/img');
//       assert(in_array('test.jpg', lsDistImg), 'dist/img/test.jpg file does not exist.');

//       const lsDistJs = shell.ls('dist/js');
//       assert(in_array('script.js', lsDistJs), 'dist/js/script.js file does not exist.');

//       // index.html
//       const indexFileContent = shell.cat('dist/index.html').stdout;
//       assert(indexFileContent == content.correctIndexFileContent, `dist/index.html has incorrect content: ${indexFileContent}`);

//     });

//   });
// });