exports.stringSimilarityThreshold = .998;

exports.correctInitOutput1 = `

Initializing new project...
Generating basic scaffold
Generating src/index.html

Copying css, js, and img files...
Building dist/index.html

Done!
`;

exports.correctInitOutput2 = `

Initializing new project...
Generating basic scaffold
Generating src/index.html
Generating src/about.html

Copying css, js, and img files...
Building dist/about.html
Building dist/index.html

Done!
`;

exports.correctIndexFileContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Website Title</title>
  
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>THIS IS THE HEADER</header>  
<main>This is <em>src/index.html</em></main>
<footer>THIS IS THE FOOTER</footer>  

<script src="js/script.js"></script>
</body>
</html>`
;

exports.correctAboutFileContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Website Title</title>
  
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>THIS IS THE HEADER</header>  
<main>This is <em>src/about.html</em></main>
<footer>THIS IS THE FOOTER</footer>  

<script src="js/script.js"></script>
</body>
</html>`
;

exports.initErrorFilesExist = `Problem generating base scaffold: Error: Make sure src/, dist/, and config.json do not exist in current directory.
`;

exports.correctBuildOutput = `
Copying css, js, and img files...
Building dist/index.html

Done!
`;

exports.correctGenerateFileOutput1 = `
Generating src/file1.html

Copying css, js, and img files...
Building dist/file1.html
Building dist/index.html

Done!
`;

exports.correctGenerateFileOutput2 = `
Generating src/file2.html
Generating src/file3.html

Copying css, js, and img files...
Building dist/file2.html
Building dist/file3.html
Building dist/index.html

Done!
`;

exports.correctGenerateFileOutput3 = `
Could not generate file: 
src/file4.html already exists
Check the src directory.
`;