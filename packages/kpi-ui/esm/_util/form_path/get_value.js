import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toArray from "@babel/runtime/helpers/toArray";
import setValue from './set_value';
import { initValue } from './utils/_helps';
import { isPlainObject } from '../validate_type';

function getValue(object, paths) {
  if (!paths.length) return [false, object];

  var _paths = _toArray(paths),
      attribute = _paths[0],
      $paths = _paths.slice(1); // 为了确保能够解析到最后一项


  if (!isPlainObject(object)) {
    var type = isPlainObject(attribute) ? attribute.type : 'object';
    return getValue(initValue(type), $paths);
  }

  if (!isPlainObject(attribute)) {
    return [attribute in object, object[attribute]];
  }

  if ('attr' in attribute) {
    var _type = attribute.type,
        attr = attribute.attr;
    return getValue(initValue(_type, object[attr]), $paths);
  }

  if ('attrs' in attribute) {
    var _type2 = attribute.type,
        attrs = attribute.attrs; // 默认 attrs 也是最后一项

    var init = [true, initValue(_type2)];
    return attrs.reduce(function (_ref, _ref2) {
      var _ref3 = _slicedToArray(_ref, 2),
          found = _ref3[0],
          result = _ref3[1];

      var left = _ref2.left,
          right = _ref2.right;

      var _getValue = getValue(object, right),
          _getValue2 = _slicedToArray(_getValue, 2),
          match = _getValue2[0],
          $value = _getValue2[1];

      if (!match) return [false && found, result];
      return [true && found, setValue(result, left, $value)];
    }, init);
  }

  return [false, object];
}

export default getValue;