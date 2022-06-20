import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useMemo, useRef } from 'react';
import { isPlainObject } from '../../validate_type';
/**
 * @description
 * 首先该hook的使用场景:
 * 为某些参数类型为对象的每个属性都保证有默认值.
 * 第一个参数为props.someProp
 * 第二个参数强制为对象.且不支持修改
 *
 * 注: 由于 js 结构的限制
 * 我们认为 attr = undefined 和 没有传该 attr 是一致的行为
 */

function usePropShim(attr, $default) {
  var ref = useRef($default);
  return useMemo(function () {
    function assign($default, target) {
      // 唯一不确定的是这里, 是否在外部传入 undefined 时仍然让其为默认值呢?
      if (target === undefined) return $default;
      if (target === null || !isPlainObject(target)) return target;
      return Object.keys($default).reduce(function (result, key) {
        if (key in target) {
          var current = assign($default[key], target[key]);
          return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, current));
        }

        return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, $default[key]));
      }, target);
    }

    return assign(ref.current, attr);
  }, [attr]);
}

export default usePropShim;