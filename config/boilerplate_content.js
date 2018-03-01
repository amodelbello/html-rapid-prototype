"use strict";
exports.config = `{
  "title": "Website Title",
  "stylesheets": [
    "style.css"
  ],
  "javascripts": [
    "script.js"
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