import cls from 'classnames'
import { useMemo } from 'react'
import { PagerProps } from './props'

export default function PageItem(props: PagerProps) {
  const { page, itemRender, disabled, active, className, prefix, showHtmlTitle, ...rest } = props

  const classes = useMemo(() => {
    return cls(`${prefix}-item`, {
      [`${prefix}-item--active`]: active,
      [`${prefix}-item--disabled`]: disabled,
      [className!]: !!className,
    })
  }, [active, className, disabled, prefix])

  const title = useMemo(() => (showHtmlTitle ? `${page}` : undefined), [page, showHtmlTitle])

  return (
    <li
      className={classes}
      title={title}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {itemRender(page, 'page', <a rel="nofollow">{page}</a>)}
    </li>
  )
}
