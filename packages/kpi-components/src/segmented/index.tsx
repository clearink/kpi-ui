import { useComposeRefs } from '@kpi-ui/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef } from 'react'
// types
import type { SegmentedProps, SegmentedRef } from './props'

const defaultProps: Partial<SegmentedProps> = {}

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<SegmentedRef>) {
  const props = withDefaults(_props, defaultProps)

  return <div></div>
}

export default withDisplayName(forwardRef(Segmented), 'Segmented')
