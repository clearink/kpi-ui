import { withDisplayName } from '@kpi-ui/utils'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { SegmentedThumbProps } from './props'

function SegmentedThumb(props: SegmentedThumbProps) {
  const { classNames, styles } = props

  return (
    <CSSTransition>
      <div className={classNames?.thumb} style={styles?.thumb}>
        123
      </div>
    </CSSTransition>
  )
}

export default withDisplayName(SegmentedThumb)
