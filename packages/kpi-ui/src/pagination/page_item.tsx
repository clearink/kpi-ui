/* eslint-disable jsx-a11y/anchor-is-valid */
import cls from 'classnames'
import { useMemo } from 'react'
import { PagerProps } from './props'

export default function PageItem(props: PagerProps) {
  const { page, itemRender, disabled, active, className, prefix, showHtmlTitle } = props

  const classes = useMemo(() => {
    return cls(`${prefix}-item`, {
      [`${prefix}-item--active`]: active,
      [`${prefix}-item--disabled`]: disabled,
      [className!]: !!className,
    })
  }, [active, className, disabled, prefix])

  const title = useMemo(() => (showHtmlTitle ? `${page}` : undefined), [page, showHtmlTitle])
  const handleClick = () => {
    console.log(1)
  }
  return (
    <li
      className={classes}
      title={title}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
    >
      {itemRender(page, 'page', <a rel="nofollow">{page}</a>)}
    </li>
  )
}
