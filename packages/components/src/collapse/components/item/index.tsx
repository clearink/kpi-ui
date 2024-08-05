import { CSSTransition } from '@comps/_shared/components'
import { keyboard, styledAttrs } from '@comps/_shared/constants'
import { usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import CaretRightOutlined from '@ink-ui/icons/esm/icons/CaretRightOutlined'
import { fallback, hasItem, isFunction, isNullish, omit } from '@internal/utils'
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
  ...styledAttrs,
] as const

function _CollapseItem(_props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const ctx = CollapseContext.useState()

  const props = withDefaults(
    {
      ..._props,
      disabled: _props.disabled || ctx.disabled,
    },
    {
      ...defaultProps,
      expandIcon: ctx.expandIcon,
      keepMounted: ctx.keepMounted,
      unmountOnExit: ctx.unmountOnExit,
    },
  )

  const { disabled, expandIcon, extra, name, showExpandIcon, title } = props

  const prefixCls = usePrefixCls('collapse-item')

  const expanded = hasItem(ctx.expandedNames, name)

  const classNames = useFormatClass(prefixCls, props, {
    ctx,
    expanded,
  })

  const styles = useSemanticStyles(props)

  const getItemClickHandler = (type: CollapsibleType) => {
    if (disabled || ctx.collapsible !== type) return undefined

    return () => { ctx.onItemClick(name) }
  }

  const handleHeaderEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === keyboard.enter) ctx.onItemClick(name)
  }

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} ref={ref} className={classNames.root} style={styles.root}>
      <div
        className={classNames.header}
        style={styles.header}
        aria-disabled={!!disabled}
        aria-expanded={!!expanded}
        role={ctx.accordion ? 'tab' : 'button'}
        tabIndex={0}
        onClick={getItemClickHandler('header')}
        onKeyDown={handleHeaderEnter}
      >
        {!!showExpandIcon && (
          <span
            className={classNames.icon}
            style={styles.icon}
            onClick={getItemClickHandler('icon')}
          >
            {isFunction(expandIcon)
              ? expandIcon({ expanded, name })
              : fallback(expandIcon, <CaretRightOutlined />)}
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

attachDisplayName(_CollapseItem, 'Collapse.Item')

const CollapseItem = forwardRef(_CollapseItem)

export default CollapseItem
