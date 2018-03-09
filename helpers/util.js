
function isPromise(possiblePromise) {
  // After adding bluebird using instanceof Promise no longer works
  if (possiblePromise === undefined) {
    return false;
  }

  if (typeof possiblePromise.then !== 'function') {
    return false;
  }

  return true;
}

// TODO: Make variable delimeters configurable
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

    if (isPromise(iteratorValue)) {
      iteratorValue
        .then(res => handle(iterator.next(res)))
        .catch(e => {
          iterator.throw(e)
        });
    }
  }

  try {
    handle(iterator.next());
  }
  catch (e) { 
    iterator.throw(e); 
  }
}