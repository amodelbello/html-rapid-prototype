# html-rapid-prototype
Template system for static html files to make prototype iterations fast and easy

Easily include partials, css, and js in your html.

## Installation
```
npm install -g html-rapid-prototype
```

## Usage

### Create A New Project
```
mkdir <project-dir>
cd <project-dir>
rp init
```
This will generate a basic scaffold with an index.html file:
```
src/
  css/
    styles.css
  js/
    script.js
  img/
    test.jpg
  layouts/
    layout.html
  partials/
    header.html
    footer.html
  index.html
  config.json
  
dist/
  css/
    styles.css
  js/
    script.js
  img/
    test.png
  index.html
```
Alternatively you can specify file names with the init command to generate content files on project creation, e.g:
```
rp init index.html contact.html about.html
```

### Build Files
```
rp build
```
This will build out all of the content files from `src` into `dist`, including partials, css, and js.

### Watch
```
rp watch
```
Build and then watch for changes in project directory.

### Generate Content File(s)
```
rp generate <filename ...>
```
Generates new content file(s) in `src` and builds. 
At least one filename must be specified.

### Configuration
`rp init` creates a `config.json` file in the `src` directory where you can specify website title and list out any css or js files you wish to be included in the generated content. Note: the css/js files must exist in src/css and src/js in order for this to work.
