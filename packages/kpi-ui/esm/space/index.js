import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["children", "size", "style", "direction", "wrap", "split"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useMemo, Children } from 'react';
import { useFlexGapSupport, usePrefix } from '../_util/hooks';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import useSpaceSize from './hooks/use_space_size';
import useSpaceClass from './hooks/use_space_class';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

function Space(props) {
  var $children = props.children,
      size = props.size,
      $style = props.style,
      direction = props.direction,
      wrap = props.wrap,
      split = props.split,
      rest = _objectWithoutProperties(props, _excluded); // 是否支持 gap 属性


  var canUseFlexGap = useFlexGapSupport();
  var name = usePrefix('space');
  var className = useSpaceClass(name, props); // 水平 垂直 间距

  var _useSpaceSize = useSpaceSize(size, !!split),
      _useSpaceSize2 = _slicedToArray(_useSpaceSize, 2),
      XGap = _useSpaceSize2[0],
      YGap = _useSpaceSize2[1]; // 垂直排列


  var vertical = direction === 'vertical';
  var style = useMemo(function () {
    var gapStyle = {};
    if (canUseFlexGap) gapStyle = {
      rowGap: YGap,
      columnGap: XGap
    };else if (wrap || vertical) gapStyle = {
      marginBottom: -YGap
    };
    return Object.assign(gapStyle, $style);
  }, [$style, XGap, YGap, canUseFlexGap, wrap, vertical]); // 处理 children

  var children = useMemo(function () {
    var count = Children.count($children);
    return Children.map($children, function (child, index) {
      var isEndItem = count - index === 1;
      var marginRight = isEndItem || vertical ? undefined : XGap;
      var paddingBottom = wrap || vertical ? YGap : undefined;
      var gapStyle = canUseFlexGap ? undefined : {
        marginRight: marginRight,
        paddingBottom: paddingBottom
      };
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx("div", {
          className: "".concat(name, "-item"),
          style: gapStyle,
          children: child
        }), split && !isEndItem && /*#__PURE__*/_jsx("span", {
          className: "".concat(name, "-item-split"),
          style: gapStyle,
          children: split
        })]
      });
    });
  }, [$children, XGap, YGap, canUseFlexGap, name, vertical, wrap, split]);
  return /*#__PURE__*/_jsx("div", _objectSpread(_objectSpread({
    className: className,
    style: style
  }, rest), {}, {
    children: children
  }));
}

export default withDefaultProps(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false
});