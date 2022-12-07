import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefix } from '@hooks'
import { BackTopProps } from '../props'

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
