import { useMemo } from 'react'
import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
// types
import type { SegmentedProps } from '../props'

export class SegmentedState {
  $root = {
    current: null as HTMLDivElement | null,
  }
}

export class SegmentedAction {
  constructor(private forceUpdate: () => void, private states: SegmentedState) {}
}

export default function useSegmentedStore(props: SegmentedProps) {
  const update = useForceUpdate()

  const states = useConstant(() => new SegmentedState())

  const actions = useMemo(() => new SegmentedAction(update, states), [update, states])

  return { states, actions }
}
