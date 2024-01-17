// utils
import { usePrefixCls } from '../../../_shared/hooks'

// comps
import { CSSTransition } from '../../../_internal/transition'

// types
import type { CollapsePanelProps } from './props'

export default function CollapsePanel(props: CollapsePanelProps) {
  const prefixCls = usePrefixCls('collapse')
  return (
    <div className="collapse-panel">
      <div className="header">header</div>
      <CSSTransition name="kpi-zoom-in-top">
        <div className="content">{props.children}</div>
      </CSSTransition>
    </div>
  )
}
