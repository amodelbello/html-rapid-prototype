exports.config = `{
  "name": "html-rapid-prototype",
  "version": "1.0.0",
  "description": "Template system for static html files to make prototype iterations fast and easy",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "html",
    "template",
    "static",
    "include",
    "prototype",
    "design"
  ],
  "author": "Amo DelBello",
  "license": "MIT",
  "dependencies": {
    "in_array": "^1.1.0",
    "yargs": "^11.0.0"
  }
}`;

exports.layout = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
exports.header = `<header>THIS IS THE HEADER</header>`;
exports.footer = `<footer>THIS IS THE FOOTER</footer>`;
exports.index = `<main>MAIN CONTENT</main>`;