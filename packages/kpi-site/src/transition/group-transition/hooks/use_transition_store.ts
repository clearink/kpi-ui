import { useConstant, useForceUpdate } from '@kpi/shared'

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void) {}
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>() {
  const forceUpdate = useForceUpdate()
  return useConstant(() => new TransitionStore(forceUpdate))
}
