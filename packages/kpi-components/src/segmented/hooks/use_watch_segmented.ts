import { useWatchValue } from '@kpi-ui/hooks'
// types
import type { SegmentedType } from '../props'
import type { SegmentedAction } from './use_segmented_store'

export default function useWatchSegmented(active: SegmentedType, actions: SegmentedAction) {
  let returnEarly = false

  useWatchValue(active, () => {
    actions.pushHistory(active)
    actions.setInTransition(true)
    returnEarly = true
  })

  return returnEarly
}
