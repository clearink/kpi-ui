// utils
import cls from 'classnames'
// types
import type { CollapseItemProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CollapseItemProps) {
  const { className, classNames } = props

  const name = `${prefixCls}-item`

  return {
    root: cls(name, className, classNames?.root),
    header: cls(`${name}__header`, classNames?.header),
    arrow: cls(`${name}__arrow`, classNames?.arrow),
    title: cls(`${name}__title`, classNames?.title),
    extra: cls(`${name}__extra`, classNames?.extra),
    content: cls(`${name}__content`, classNames?.content),
  }
}
