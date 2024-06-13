import {
  fallback,
  hasItem,
  isFunction,
  isNullish,
  omit,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef } from 'react'
import { Keyboard } from '../../../_shared/constants'
import { usePrefixCls, useSemanticStyles } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import handlers from './utils/transition_handlers'
// comps
import { CaretRightOutlined } from '@kpi-ui/icons'
import { CSSTransition } from '../../../_internal/transition'
// types
import type { CollapsibleType } from '../collapse/props'
import type { CollapseItemProps } from './props'

const defaultProps: Partial<CollapseItemProps> = {
  showExpandIcon: true,
}

const excluded = [
  'name',
  'title',
  'extra',
  'disabled',
  'showExpandIcon',
  'keepMounted',
  'unmountOnExit',
  'expandIcon',
  // 子元素
  'children',
  // 样式
  'className',
  'classNames',
  'style',
  'styles',
] as const

function CollapseItem(_props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const ctx = CollapseContext.useState()

  const props = withDefaults(
    {
      ..._props,
      disabled: _props.disabled || ctx.disabled,
    },
    {
      ...defaultProps,
      keepMounted: ctx.keepMounted,
      unmountOnExit: ctx.unmountOnExit,
      expandIcon: fallback(ctx.expandIcon, <CaretRightOutlined />),
    }
  )

  const { name, title, extra, disabled, showExpandIcon, expandIcon, style, styles: _styles } = props

  const prefixCls = usePrefixCls('collapse-item')

  const expanded = hasItem(ctx.expandedNames, name)

  const classNames = useFormatClass(prefixCls, props, {
    ctx,
    expanded,
  })

  const styles = useSemanticStyles(style, _styles)

  const getItemClickHandler = (type: CollapsibleType) => {
    if (disabled || ctx.collapsible !== type) return undefined

    return () => ctx.onItemClick(name)
  }

  const handleHeaderEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === Keyboard.enter) ctx.onItemClick(name)
  }

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} ref={ref} className={classNames.root} style={styles.root}>
      <div
        className={classNames.header}
        style={styles.header}
        aria-expanded={!!expanded}
        aria-disabled={!!disabled}
        role={ctx.accordion ? 'tab' : 'button'}
        tabIndex={0}
        onKeyDown={handleHeaderEnter}
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
        name={`${prefixCls}-motion`}
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

export default withDisplayName(forwardRef(CollapseItem), 'CollapseItem')
