import { withDisplayName } from '@kpi-ui/utils'
import { useEffect } from 'react'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { SegmentedThumbProps } from './props'

function SegmentedThumb(props: SegmentedThumbProps) {
  const { className, style, active, states, actions } = props

  useEffect(() => {
    console.log('active change', active, states)
    // 比对前后的
  }, [active, states])

  return (
    <CSSTransition
      when
      key={active}
      unmountOnExit
      onEnter={() => {
        actions.setInTransition(true)
      }}
      onEnterCancel={() => {
        actions.setInTransition(false)
      }}
      onEntered={() => {
        actions.setInTransition(false)
      }}
    >
      <div className={className} style={style}></div>
    </CSSTransition>
  )
}

export default withDisplayName(SegmentedThumb)
