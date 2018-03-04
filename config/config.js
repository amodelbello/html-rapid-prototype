// TODO: Make the src and dist directory names configurable
// FIXME: Change these propery names to camel case
module.exports = {
  source_dir: 'src',
  layouts_dir: 'src/layouts',
  partials_dir: 'src/partials',
  destination_dir: 'dist',
  patternVariable: /{{(.*)}}/g // just match anything inside the delimiters
}