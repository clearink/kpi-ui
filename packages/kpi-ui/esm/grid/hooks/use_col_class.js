import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { useMemo } from 'react';
import cls from 'classnames';
export default function useColClass(name, props) {
  var span = props.span;
  return useMemo(function () {
    return cls(name, _defineProperty({}, "".concat(name, "-").concat(span), true));
  }, [name, span]);
}