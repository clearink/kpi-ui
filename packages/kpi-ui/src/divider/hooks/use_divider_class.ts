import { DividerProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'
import usePrefix from '../../hooks/use_prefix'

export default function useDividerClass(props: DividerProps) {
  const name = usePrefix('divider')
  const { type, dashed, orientation } = props
  return useMemo(() => {
    return cls(name, {
      [`${name}--${type}`]: type,
      [`${name}--dashed`]: dashed,
      [`${name}--text-${orientation}`]: orientation,
    })
  }, [type, dashed])
}
