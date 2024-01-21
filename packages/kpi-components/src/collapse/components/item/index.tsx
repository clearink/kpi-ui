// utils
import { fallback, hasItem, isFunction, isNullish, withDefaults } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import handlers from './utils/transition_handlers'
import getSemanticStyles from '../../utils/semantic_styles'
// comps
import { CaretRightOutlined } from '@kpi-ui/icons'
import { CSSTransition } from '../../../_internal/transition'
// types
import type { CollapseItemProps } from './props'
import type { CollapsibleType } from '../collapse/props'

function CollapseItem(props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const { name, title, extra, disabled, showExpandIcon } = props

  const ctx = CollapseContext.useState()

  const prefixCls = usePrefixCls('collapse')

  const expanded = hasItem(ctx.expandedNames, name)

  const classNames = useFormatClass(prefixCls, props, {
    ctx,
    expanded,
  })

  const styles = getSemanticStyles(props.style, props.styles)

  const keepMounted = fallback(props.keepMounted, ctx.keepMounted)

  const unmountOnExit = fallback(props.unmountOnExit, ctx.unmountOnExit)

  const expandIcon = fallback(props.expandIcon, ctx.expandIcon, <CaretRightOutlined />)

  const getItemClickHandler = (type: CollapsibleType) => {
    if (disabled || !hasItem(ctx.collapsible, type)) return undefined

    return () => ctx.onItemClick(name)
  }

  return (
    <div ref={ref} className={classNames.root} style={styles.root}>
      <div
        className={classNames.header}
        style={styles.header}
        aria-expanded={!!expanded}
        aria-disabled={!!disabled}
        role={ctx.accordion ? 'tab' : 'button'}
        tabIndex={0}
      >
        {!!showExpandIcon && (
          <span
            className={classNames.icon}
            style={styles.icon}
            onClick={getItemClickHandler('icon')}
          >
            {isFunction(expandIcon) ? expandIcon({ name, expanded }) : expandIcon}
          </span>
        )}
        <span
          className={classNames.title}
          style={styles.title}
          onClick={getItemClickHandler('title')}
        >
          {title}
        </span>
        {!isNullish(extra) && (
          <span
            className={classNames.extra}
            style={styles.extra}
            onClick={getItemClickHandler('extra')}
          >
            {extra}
          </span>
        )}
      </div>
      <CSSTransition
        when={expanded}
        mountOnEnter={!keepMounted}
        unmountOnExit={!keepMounted && unmountOnExit}
        name={`${prefixCls}-transition`}
        {...handlers}
      >
        <div role={ctx.accordion ? 'tabpanel' : undefined}>
          <div className={classNames.content} style={styles.content}>
            {props.children}
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

export default withDefaults(forwardRef(CollapseItem), {
  showExpandIcon: true,
})
