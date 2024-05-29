import { useMemo } from 'react'
import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
// types
import type { SegmentedOption, SegmentedType } from '../props'

export class SegmentedState {
  $group = {
    current: null as HTMLDivElement | null,
  }

  inTransition = false

  history: [SegmentedType | null, SegmentedType | null] = [null, null]

  get isFirst() {
    return this.history[0] === null
  }

  items = new Map<SegmentedType, HTMLElement | null>()
}

export class SegmentedAction {
  constructor(private forceUpdate: () => void, private states: SegmentedState) {}

  setItem = (el: HTMLElement | null, option: SegmentedOption) => {
    // console.log(el)
  }

  setInTransition = (value: boolean) => {
    const { inTransition } = this.states

    if (inTransition !== value) this.forceUpdate()

    this.states.inTransition = value
  }

  pushHistory = (value: SegmentedType) => {
    this.states.history = [this.states.history[1], value]
  }
}

export default function useSegmentedStore() {
  const update = useForceUpdate()

  const states = useConstant(() => new SegmentedState())

  const actions = useMemo(() => new SegmentedAction(update, states), [update, states])

  return { states, actions }
}
