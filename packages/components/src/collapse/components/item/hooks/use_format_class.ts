import { cls } from '@kpi-ui/utils'

import type { CollapseContextState } from '../../../_shared/context'
import type { CollapseItemProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: CollapseItemProps,
  { ctx, expanded }: { ctx: CollapseContextState; expanded: boolean },
) {
  const { className, classNames, disabled } = props

  return {
    content: cls(`${prefixCls}__content`, classNames?.content),
    extra: cls(`${prefixCls}__extra`, classNames?.extra),
    header: cls(
      `${prefixCls}__header`,
      {
        [`${prefixCls}__collapsible`]: ctx.collapsible === 'header',
      },
      classNames?.header,
    ),
    icon: cls(
      `${prefixCls}__icon`,
      {
        [`${prefixCls}__collapsible`]: ctx.collapsible === 'icon',
      },
      classNames?.icon,
    ),
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--disabled`]: disabled,
        [`${prefixCls}--expanded`]: expanded,
      },
      className,
      classNames?.root,
    ),
    title: cls(
      `${prefixCls}__title`,
      {
        [`${prefixCls}__collapsible`]: ctx.collapsible === 'title',
      },
      classNames?.title,
    ),
  }
}
