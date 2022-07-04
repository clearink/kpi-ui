import { useMemo } from 'react';
import cls from 'classnames';
// import { ColProps } from '../props';

export default function useColClass(name: string) {
  return useMemo(() => cls(name, {}), [name]);
}
