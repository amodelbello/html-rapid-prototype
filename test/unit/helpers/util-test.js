const util = require('../../../helpers/util');
const assert = require('assert');

describe('helpers/util.js', () => {
  describe('.getFileNameFromVariableName(variableName)', () => {
    it('should get the correct included file name from variable name in template', () => {

      let testData = new Map();
      //                    input                    output
      testData.set('{{ directory/file.html }}', 'directory/file.html');
      testData.set('{{directory/file.html}}', 'directory/file.html');
      testData.set('{directory/file.html}', '{directory/file.html}');
      testData.set('  {{ directory/file.html }}  ', 'directory/file.html');
      testData.set('{{ directory/file.html }', 'directory/file.html }');
      testData.set('{ directory/file.html }}', '{ directory/file.html');

      for(let [variableName, fileName] of testData.entries()) {
        let output = util.getFileNameFromVariableName(variableName);
        let message = `${output} should equal ${fileName}`;
        assert(output === fileName, message);
      }

    });
  });
});