import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import { useMemo } from 'react';
import cls from 'classnames';
export default function useRowClass(name, props) {
  _objectDestructuringEmpty(props);

  return useMemo(function () {
    return cls(name, {});
  }, [name]);
}