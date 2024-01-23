// utils
import {
  fallback,
  hasItem,
  isFunction,
  isNullish,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
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

export const defaultProps: Partial<CollapseItemProps> = {
  showExpandIcon: true,
}

function CollapseItem(_props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const ctx = CollapseContext.useState()

  const props = withDefaults(_props, {
    ...defaultProps,
    keepMounted: ctx.keepMounted,
    unmountOnExit: ctx.unmountOnExit,
    expandIcon: fallback(ctx.expandIcon, <CaretRightOutlined />),
  })

  const { name, title, extra, disabled, showExpandIcon, expandIcon } = props

  const prefixCls = usePrefixCls('collapse')

  const expanded = hasItem(ctx.expandedNames, name)

  const classNames = useFormatClass(prefixCls, props, {
    ctx,
    expanded,
  })

  const styles = getSemanticStyles(props.style, props.styles)

  const getItemClickHandler = (type: CollapsibleType) => {
    if (disabled || ctx.collapsible !== type) return undefined

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
        onClick={getItemClickHandler('header')}
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
          <span className={classNames.extra} style={styles.extra}>
            {extra}
          </span>
        )}
      </div>
      <CSSTransition
        when={expanded}
        mountOnEnter={!props.keepMounted}
        unmountOnExit={!props.keepMounted && props.unmountOnExit}
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

export default withDisplayName(forwardRef(CollapseItem))
