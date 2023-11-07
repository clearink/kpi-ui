import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'
import { BackTopProps } from '../props'

export default function useFormatClass(props: BackTopProps) {
  const { className } = props
  const name = usePrefixCls('back-top')
  return cls(name, className)
}
