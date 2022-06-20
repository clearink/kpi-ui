import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { useMemo } from 'react';
import cls from 'classnames';
export default function useBtnClass(name, props) {
  var type = props.type,
      block = props.block,
      danger = props.danger,
      shape = props.shape,
      size = props.size,
      ghost = props.ghost,
      loading = props.loading;
  return useMemo(function () {
    var _cls;

    return cls(name, (_cls = {}, _defineProperty(_cls, "".concat(name, "--").concat(type), type), _defineProperty(_cls, "".concat(name, "--block"), block), _defineProperty(_cls, "".concat(name, "--danger"), danger), _defineProperty(_cls, "".concat(name, "--circle"), shape === 'circle'), _defineProperty(_cls, "".concat(name, "--round"), shape === 'round'), _defineProperty(_cls, "".concat(name, "--lg"), size === 'large'), _defineProperty(_cls, "".concat(name, "--sm"), size === 'small'), _defineProperty(_cls, "".concat(name, "--ghost"), ghost), _defineProperty(_cls, "".concat(name, "--loading"), loading), _cls));
  }, [name, type, block, danger, shape, size, ghost, loading]);
}