import { CSSTransition } from '@comps/_shared/components'
import { keyboard, styledAttrs } from '@comps/_shared/constants'
import { usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import CaretRightOutlined from '@ink-ui/icons/esm/icons/CaretRightOutlined'
import { isFunction, isNullish, omit, pick } from '@internal/utils'
import { type ForwardedRef, forwardRef } from 'react'

import type { CollapsibleType } from '../collapse/props'

import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import { type CollapseItemProps, defaultCollapseItemProps } from './props'
import handlers from './utils/transition_handlers'

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
    { ..._props, disabled: _props.disabled || ctx.disabled },
    pick(ctx, ['expandIcon', 'keepMounted', 'unmountOnExit']),
    { ...defaultCollapseItemProps, expandIcon: <CaretRightOutlined /> },
  )

  const { disabled, expandIcon, extra, name, showExpandIcon, title } = props

  const prefixCls = usePrefixCls('collapse-item')

  const expanded = ctx.expandedNames.includes(name)

  const classNames = useFormatClass(prefixCls, props, { ctx, expanded })

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
            {isFunction(expandIcon) ? expandIcon({ expanded, name }) : expandIcon}
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
