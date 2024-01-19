// utils
import cls from 'classnames'
// types
import type { CollapseProps } from '../props'
import type { ExpandedKey } from '../../../props'

export default function useFormatClass(prefixCls: string, props: CollapseProps) {
  const { bordered, ghost, className, classNames } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--bordered`]: bordered && !ghost,
      [`${prefixCls}--ghost`]: ghost,
    },
    className,
    classNames?.root
  )
}
