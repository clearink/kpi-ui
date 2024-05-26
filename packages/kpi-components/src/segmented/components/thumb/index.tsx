import { withDisplayName } from '@kpi-ui/utils'
import { useEffect } from 'react'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { SegmentedThumbProps } from './props'

function SegmentedThumb(props: SegmentedThumbProps) {
  const { className, style, active } = props

  useEffect(() => {
    console.log('active change', active)
    // 比对前后的
  }, [active])

  return (
    <CSSTransition>
      <div key={active} className={className} style={style}>
        123
      </div>
    </CSSTransition>
  )
}

export default withDisplayName(SegmentedThumb)
