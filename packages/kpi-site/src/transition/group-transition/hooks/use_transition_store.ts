import { useConstant, useForceUpdate } from '@kpi/shared'
import { ReactElement } from 'react'

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void) {}

  current: ReactElement[] = []
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>() {
  const forceUpdate = useForceUpdate()
  return useConstant(() => new TransitionStore(forceUpdate))
}
