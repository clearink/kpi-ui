// utils
import { usePrefixCls } from '../../../_shared/hooks'
import handlers from './utils/transition_handlers'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { ExpandedKey } from '../../props'
import type { CollapseItemProps } from './props'
import { CollapseContext } from '../../_shared/context'

export default function CollapseItem<K extends ExpandedKey>(props: CollapseItemProps<K>) {
  const { name, title, extra } = props

  const prefixCls = usePrefixCls('collapse')

  const { expandedKeys } = CollapseContext.useState()

  const expanded = expandedKeys?.includes(name)

  return (
    <div className={`${prefixCls}-item`}>
      <div
        className={`${prefixCls}-item__header`}
        aria-expanded={expanded}
        aria-disabled="false"
        role="tab"
        tabIndex={0}
      >
        {expanded ? '-' : '+'}
        {title}
        {extra}
      </div>
      <CSSTransition when={expanded} unmountOnExit name={`${prefixCls}-transition`} {...handlers}>
        <div>
          <div className={`${prefixCls}-item__content`}>{props.children}</div>
        </div>
      </CSSTransition>
    </div>
  )
}
