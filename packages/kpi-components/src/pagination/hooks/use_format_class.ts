import cls from 'classnames'
import { PaginationProps } from '../props'

export default function useFormatClass(prefixCls: string, props: PaginationProps) {
  const { className } = props
  return cls(prefixCls, className)
}
