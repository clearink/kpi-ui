import { useMemo } from 'react'
import cls from 'classnames'
// import { RowProps } from '../props';

export default function useRowClass(name: string) {
  return useMemo(() => cls(name, {}), [name])
}
