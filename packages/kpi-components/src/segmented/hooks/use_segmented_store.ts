import { useMemo } from 'react'
import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
// types
import type { SegmentedOption, SegmentedProps } from '../props'

export class SegmentedState {
  $root = {
    current: null as HTMLDivElement | null,
  }

  inTransition = false
}

export class SegmentedAction {
  constructor(private forceUpdate: () => void, private states: SegmentedState) {}

  setItem = (el: HTMLElement | null, option: SegmentedOption) => {
    console.log(el)
  }

  setInTransition = (value: boolean) => {
    const { inTransition } = this.states

    if (inTransition !== value) this.forceUpdate()

    this.states.inTransition = value
  }
}

export default function useSegmentedStore(props: SegmentedProps) {
  const update = useForceUpdate()

  const states = useConstant(() => new SegmentedState())

  const actions = useMemo(() => new SegmentedAction(update, states), [update, states])

  return { states, actions }
}
