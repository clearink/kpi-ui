import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { useMemo } from 'react';
import cls from 'classnames';
export default function useDividerClass(name, props) {
  var type = props.type,
      dashed = props.dashed,
      orientation = props.orientation,
      children = props.children,
      plain = props.plain,
      className = props.className,
      orientationMargin = props.orientationMargin; // 自定义边距

  var customMargin = useMemo(function () {
    return ['left', 'right'].includes(orientation) && orientationMargin !== undefined;
  }, [orientation, orientationMargin]);
  return useMemo(function () {
    var _cls;

    return cls(name, (_cls = {}, _defineProperty(_cls, "".concat(name, "--").concat(type), type), _defineProperty(_cls, "".concat(name, "--dashed"), dashed), _defineProperty(_cls, "".concat(name, "--plain"), plain), _defineProperty(_cls, "".concat(name, "--with-text"), children), _defineProperty(_cls, "".concat(name, "--text-").concat(orientation), orientation), _defineProperty(_cls, "".concat(name, "--custom-margin"), customMargin), _cls), className);
  }, [name, type, dashed, children, customMargin, plain, orientation, className]);
}