// utils
import { hasItem, isNullish, withDefaults } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useState } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import useFormatStyles from './hooks/use_format_styles'
import handlers from './utils/transition_handlers'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { CollapseItemProps } from './props'
import { toSemanticStyles } from '../../utils/format_styles'

function CollapseItem(props: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) {
  const { name, title, extra } = props

  const { expandedKeys, onItemExpand } = CollapseContext.useState()

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useFormatStyles(props)

  const expanded = hasItem(expandedKeys, name)

  return (
    <div ref={ref} className={classNames.root} style={styles.root}>
      <div
        className={classNames.header}
        style={styles.header}
        // aria-expanded={expanded}
        // aria-disabled="false"
        // // role="tab"
        // tabIndex={0}
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
      <CSSTransition when={expanded} unmountOnExit name={`${prefixCls}-transition`} {...handlers}>
        <div>
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
