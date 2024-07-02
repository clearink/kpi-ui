import { cls } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { PagerProps } from './props'

export default function PageItem(props: PagerProps) {
  const { active, className, disabled, itemRender, page, prefix, showHtmlTitle, ...rest } = props

  const classes = cls(
    `${prefix}-item`,
    {
      [`${prefix}-item--active`]: active,
      [`${prefix}-item--disabled`]: disabled,
    },
    className,
  )

  const title = useMemo(() => (showHtmlTitle ? `${page}` : undefined), [page, showHtmlTitle])

  return (
    <li className={classes} tabIndex={disabled ? -1 : 0} title={title} {...rest}>
      {itemRender(page, 'page', <a rel="nofollow">{page}</a>)}
    </li>
  )
}
