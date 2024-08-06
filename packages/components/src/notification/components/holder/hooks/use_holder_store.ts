import type { VoidFn } from '@internal/types'

import { useConstant, useForceUpdate } from '@comps/_shared/hooks'
import { useMemo } from 'react'

export class HolderState {}
export class HolderAction {
  constructor(public forceUpdate: VoidFn, private states: HolderState) {}
}

export default function useHolderStore() {
  const update = useForceUpdate()

  const states = useConstant(() => new HolderState())

  const actions = useMemo(() => new HolderAction(update, states), [update, states])

  return { states, actions }
}
