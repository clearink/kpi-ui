import { useMemo } from 'react';
import cls from 'classnames'; // import { PaginationProps } from '../props';

export default function usePaginationProps(name) {
  return useMemo(function () {
    return cls(name, {});
  }, [name]);
}