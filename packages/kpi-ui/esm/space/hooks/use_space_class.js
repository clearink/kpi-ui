import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { useMemo } from 'react';
import cls from 'classnames';
export default function useDividerClass(name, props) {
  var className = props.className,
      direction = props.direction,
      $align = props.align,
      wrap = props.wrap;
  var align = useMemo(function () {
    var useDefault = direction === 'horizontal' && $align === undefined;
    return useDefault ? 'center' : $align;
  }, [$align, direction]);
  return useMemo(function () {
    var _cls;

    return cls(name, (_cls = {}, _defineProperty(_cls, "".concat(name, "--").concat(direction), direction), _defineProperty(_cls, "".concat(name, "--align-").concat(align), align), _defineProperty(_cls, "".concat(name, "--wrap"), wrap), _cls), className);
  }, [name, direction, align, wrap, className]);
}