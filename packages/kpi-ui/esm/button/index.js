import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["children", "htmlType", "type"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useEffect } from 'react';
import { withDefault, omit } from '../_utils';
import { usePrefix, useWave } from '../_hooks';
import useBtnClass from './hooks/use_btn_class';
import { jsx as _jsx } from "react/jsx-runtime";

function Button(props) {
  var children = props.children,
      htmlType = props.htmlType,
      type = props.type,
      rest = _objectWithoutProperties(props, _excluded);

  var attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost', 'loading']);

  var _useWave = useWave(usePrefix('wave')),
      _useWave2 = _slicedToArray(_useWave, 2),
      ref = _useWave2[0],
      destroy = _useWave2[1];

  useEffect(function () {
    if (type === 'text') destroy.current();
  }, [destroy, type]);
  var className = useBtnClass(usePrefix('button'), props);
  return /*#__PURE__*/_jsx("button", _objectSpread(_objectSpread({
    className: className,
    ref: ref,
    type: htmlType
  }, attrs), {}, {
    children: /*#__PURE__*/_jsx("span", {
      children: children
    })
  }));
}

export default withDefault(Button, {
  htmlType: 'button',
  type: 'default'
});