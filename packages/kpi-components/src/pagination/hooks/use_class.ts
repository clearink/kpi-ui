import cls from 'classnames'
import { PaginationProps } from '../props'

export default function useClass(name: string, props: PaginationProps) {
  const { className } = props
  return cls(name, className)
}
