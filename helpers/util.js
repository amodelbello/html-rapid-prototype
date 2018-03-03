exports.getFileNameFromVariableName = (variableName) => {
  let filename = variableName.replace('{{', '')
  .replace('}}', '')
  .trim();

  return filename;
}

exports.async = (generator) => {
  var iterator = generator();

  function handle(iteratorResult) {
    if (iteratorResult.done) {
      return;
    }

    const iteratorValue = iteratorResult.value;

    if (iteratorValue instanceof Promise) {
      iteratorValue
        .then(res => handle(iterator.next(res)))
        .catch(e => {
          logger.error();
          iterator.throw(e)
        });
    }
  }

  try {
    handle(iterator.next());
  }
  catch (e) { 
    logger.error();
    iterator.throw(e); 
  }
}