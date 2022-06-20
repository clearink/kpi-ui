import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["children", "orientation", "orientationMargin"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useMemo } from 'react';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import { usePrefix } from '../_util/hooks';
import capitalize from '../_util/capitalize';
import { omit } from '../_util/value';
import useDividerClass from './hooks/use_divider_class';
import { jsx as _jsx } from "react/jsx-runtime";

function Divider(props) {
  var children = props.children,
      orientation = props.orientation,
      orientationMargin = props.orientationMargin,
      rest = _objectWithoutProperties(props, _excluded);

  var attrs = omit(rest, ['className', 'type', 'dashed', 'plain']);
  var name = usePrefix('divider');
  var className = useDividerClass(name, props);
  var innerStyle = useMemo(function () {
    var prop = "margin".concat(capitalize(orientation));
    return _defineProperty({}, prop, orientationMargin);
  }, [orientation, orientationMargin]);
  return /*#__PURE__*/_jsx("div", _objectSpread(_objectSpread({
    className: className
  }, attrs), {}, {
    children: children && /*#__PURE__*/_jsx("span", {
      className: "".concat(name, "__inner-text"),
      style: innerStyle,
      children: children
    })
  }));
}

export default withDefaultProps(Divider, {
  dashed: false,
  orientation: 'center',
  plain: false,
  type: 'horizontal'
});