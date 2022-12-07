import { useMemo } from 'react'
import cls from 'classnames'
import { BackTopProps } from '../props'
import { usePrefix } from '../../_internal/hooks'

export default function useClass(props: BackTopProps) {
  const { className } = props
  const name = usePrefix('back-top')
  return useMemo(
    () =>
      cls(name, {
        [`${className!}`]: !!className,
      }),
    [name, className]
  )
}
