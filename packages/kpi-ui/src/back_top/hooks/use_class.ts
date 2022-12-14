import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'
import { BackTopProps } from '../props'

export default function useClass(props: BackTopProps) {
  const { className } = props
  const name = usePrefixCls('back-top')
  return useMemo(() => {
    return cls(name, className)
  }, [name, className])
}
