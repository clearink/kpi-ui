import cls from 'classnames'

import type { BadgeProps } from '../props'

export default function useFormatClass(prefixCls: string, props: BadgeProps) {
  const { className } = props

  return cls(prefixCls, {}, className)
}
