// utils
import { fallback, hasItem, isNullish, withDefaults } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import handlers from './utils/transition_handlers'
import getSemanticStyles from '../../utils/semantic_styles'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { CollapseItemProps } from './props'

function CollapseItem(props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const { name, title, extra } = props

  const {
    accordion,
    expandedKeys,
    onItemExpand,
    keepMounted: _keepMounted,
    unmountOnExit: _unmountOnExit,
  } = CollapseContext.useState()

  const keepMounted = fallback(props.keepMounted, _keepMounted)

  const unmountOnExit = fallback(props.unmountOnExit, _unmountOnExit)

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const styles = getSemanticStyles(props.style, props.styles)

  const expanded = hasItem(expandedKeys, name)

  return (
    <div ref={ref} className={classNames.root} style={styles.root}>
      <div
        className={classNames.header}
        style={styles.header}
        aria-expanded={expanded}
        // aria-disabled="false"
        role={accordion ? 'tab' : 'button'}
        tabIndex={0}
        onClick={() => onItemExpand(name)}
      >
        {/* {showArrow && <span className={classNames.arrow}>{expanded ? '-' : '+'}</span>} */}
        <span className={classNames.title} style={styles.title}>
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
        mountOnEnter={!keepMounted}
        unmountOnExit={!keepMounted && unmountOnExit}
        name={`${prefixCls}-transition`}
        {...handlers}
      >
        <div role={accordion ? 'tabpanel' : undefined}>
          <div className={classNames.content} style={styles.content}>
            {props.children}
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

export default withDefaults(forwardRef(CollapseItem), {
  showArrow: true,
})
