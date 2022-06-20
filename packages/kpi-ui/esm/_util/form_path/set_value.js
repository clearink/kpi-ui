import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toArray from "@babel/runtime/helpers/toArray";
import getValue from './get_value';
import { initValue } from './utils/_helps';
import { isArray, isPlainObject } from '../validate_type';

function setValue(object, paths, value) {
  if (!paths.length || !isPlainObject(object)) return object;

  var _paths = _toArray(paths),
      attribute = _paths[0],
      $paths = _paths.slice(1);

  if (!isPlainObject(attribute)) {
    if (isArray(object) && isNaN(+attribute)) return object;
    object[attribute] = value;
  } else if ('attr' in attribute) {
    var type = attribute.type,
        attr = attribute.attr;
    object[attr] = setValue(initValue(type, object[attr]), $paths, value);
  } else if ('attrs' in attribute) {
    // 默认 attrs 也是最后一项
    return attribute.attrs.reduce(function (result, _ref) {
      var left = _ref.left,
          right = _ref.right;

      var _getValue = getValue(value, left),
          _getValue2 = _slicedToArray(_getValue, 2),
          match = _getValue2[0],
          $value = _getValue2[1];

      if (!match) return result; // 匹配失败就不用继续 set 了

      return setValue(result, right, $value);
    }, object);
  }

  return object;
}

export default setValue;