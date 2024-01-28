// utils
import { cls } from '@kpi-ui/utils'
// types
import type { CollapseItemProps } from '../props'
import type { CollapseContextState } from '../../../_shared/context'

export default function useFormatClass(
  prefixCls: string,
  props: CollapseItemProps,
  { ctx, expanded }: { ctx: CollapseContextState; expanded: boolean }
) {
  const { className, classNames, disabled } = props

  const name = `${prefixCls}-item`

  return {
    root: cls(
      name,
      className,
      {
        [`${name}--disabled`]: disabled,
        [`${name}--expanded`]: expanded,
      },
      classNames?.root
    ),
    header: cls(
      `${name}__header`,
      {
        [`${name}__collapsible`]: ctx.collapsible === 'header',
      },
      classNames?.header
    ),
    icon: cls(
      `${name}__icon`,
      {
        [`${name}__collapsible`]: ctx.collapsible === 'icon',
      },
      classNames?.icon
    ),
    title: cls(
      `${name}__title`,
      {
        [`${name}__collapsible`]: ctx.collapsible === 'title',
      },
      classNames?.title
    ),
    extra: cls(`${name}__extra`, classNames?.extra),
    content: cls(`${name}__content`, classNames?.content),
  }
}
