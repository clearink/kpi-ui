import type { StyledProps } from '@kpi-ui/types'
import type { SegmentedType } from '../../props'
import type { SegmentedAction, SegmentedState } from '../../hooks/use_segmented_store'

export interface SegmentedThumbProps extends StyledProps {
  active: SegmentedType
  states: SegmentedState
  actions: SegmentedAction
}
