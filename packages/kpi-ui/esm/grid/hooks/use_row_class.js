import { useMemo } from 'react';
import cls from 'classnames'; // import { RowProps } from '../props';

export default function useRowClass(name) {
  return useMemo(function () {
    return cls(name, {});
  }, [name]);
}