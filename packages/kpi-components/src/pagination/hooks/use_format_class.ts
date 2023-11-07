import cls from 'classnames'
import { PaginationProps } from '../props'

export default function useFormatClass(name: string, props: PaginationProps) {
  const { className } = props
  return cls(name, className)
}
