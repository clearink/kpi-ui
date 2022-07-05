import { useMemo } from 'react';
import cls from 'classnames';
// import { PaginationProps } from '../props';

export default function usePaginationProps(name: string) {
  return useMemo(() => cls(name, {}), [name]);
}
