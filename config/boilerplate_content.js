exports.usage = `
html-rapid-prototype
Template system for static html files to make prototype iterations fast and easy

Usage: 

  rp init [files ...]       Create basic scaffold. If no files specified defaults to single index.html file
  rp build                  Build static html files
  rp wait                   Trigger build on all changes to source directory
  rp generate <files ...>   Generate new content source file(s), at least one file is required

Options:

  -h, --help                output usage information (this message)
  -V, --version             output the version number

  GitHub repository: https://github.com/amodelbello/html-rapid-prototype
`;

exports.config = `{
  "title": "Website Title",
  "stylesheets": [
    "css/style.css"
  ],
  "javascripts": [
    "js/script.js"
  ]
}`;

exports.layout = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{ __title__ }}</title>
  {{ __styles__ }}
</head>
<body>
{{ partials/header.html }}  
{{ __main__ }}
{{ partials/footer.html }}  
{{ __javascript__ }}
</body>
</html>`;
exports.header = `<header>THIS IS THE HEADER</header>`;
exports.footer = `<footer>THIS IS THE FOOTER</footer>`;
exports.index = `<main>MAIN CONTENT</main>`;