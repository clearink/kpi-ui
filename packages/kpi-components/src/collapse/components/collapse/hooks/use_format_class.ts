// utils
import cls from 'classnames'
// types
import type { CollapseProps } from '../props'
import type { ExpandedKey } from '../../../props'

export default function useFormatClass<K extends ExpandedKey>(
  prefixCls: string,
  props: CollapseProps<K>
) {
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
