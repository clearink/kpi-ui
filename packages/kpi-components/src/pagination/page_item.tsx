// utils
import { cls } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { PagerProps } from './props'

export default function PageItem(props: PagerProps) {
  const { page, itemRender, disabled, active, className, prefix, showHtmlTitle, ...rest } = props

  const classes = cls(
    `${prefix}-item`,
    {
      [`${prefix}-item--active`]: active,
      [`${prefix}-item--disabled`]: disabled,
    },
    className
  )

  const title = useMemo(() => (showHtmlTitle ? `${page}` : undefined), [page, showHtmlTitle])

  return (
    <li className={classes} title={title} tabIndex={disabled ? -1 : 0} {...rest}>
      {itemRender(page, 'page', <a rel="nofollow">{page}</a>)}
    </li>
  )
}
