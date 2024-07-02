import { CaretRightOutlined } from '@kpi-ui/icons'
import {
  fallback,
  hasItem,
  isFunction,
  isNullish,
  omit,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { CSSTransition } from '_shared/components'
import { Keyboard } from '_shared/constants'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { type ForwardedRef, forwardRef } from 'react'

import type { CollapsibleType } from '../collapse/props'
import type { CollapseItemProps } from './props'

import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import handlers from './utils/transition_handlers'

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
      expandIcon: fallback(ctx.expandIcon, <CaretRightOutlined />),
      keepMounted: ctx.keepMounted,
      unmountOnExit: ctx.unmountOnExit,
    },
  )

  const { disabled, expandIcon, extra, name, showExpandIcon, style, styles: _styles, title } = props

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
    <div {...attrs} className={classNames.root} ref={ref} style={styles.root}>
      <div
        aria-disabled={!!disabled}
        aria-expanded={!!expanded}
        className={classNames.header}
        onClick={getItemClickHandler('header')}
        onKeyDown={handleHeaderEnter}
        role={ctx.accordion ? 'tab' : 'button'}
        style={styles.header}
        tabIndex={0}
      >
        {!!showExpandIcon && (
          <span
            className={classNames.icon}
            onClick={getItemClickHandler('icon')}
            style={styles.icon}
          >
            {isFunction(expandIcon) ? expandIcon({ expanded, name }) : expandIcon}
          </span>
        )}
        <span
          className={classNames.title}
          onClick={getItemClickHandler('title')}
          style={styles.title}
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
        mountOnEnter={!props.keepMounted}
        name={`${prefixCls}-motion`}
        unmountOnExit={!props.keepMounted && props.unmountOnExit}
        when={expanded}
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
