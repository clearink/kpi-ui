function omit(obj, keys) {
  var result = Object.assign({}, obj);

  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];
    delete result[key];
  }

  return result;
}

function pick(obj, keys) {
  var allowUndefined = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var result = {};

  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];
    if (!allowUndefined && obj[key] === undefined) continue;
    result[key] = obj[key];
  }

  return result;
}

export { omit, pick };