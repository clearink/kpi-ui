import { useConstant, useForceUpdate } from '@kpi-ui/hooks'

import type { OverlayProps } from '../props'

export class OverlayStore {
  isInitial = true

  setIsInitial = (value: boolean) => {
    this.isInitial = value
  }

  // 过渡中
  inTransition = false

  setInTransition = (value: boolean) => {
    if (this.inTransition !== value) this.forceUpdate()

    this.inTransition = value
  }

  shouldMounted = false

  setShouldMounted = (value: boolean) => {
    if (this.shouldMounted !== value) this.forceUpdate()

    this.shouldMounted = value
  }

  constructor(props: OverlayProps, public forceUpdate: () => void) {
    this.isInitial = !props.open
    this.shouldMounted = !!props.unmountOnClose
  }
}

export default function useOverlayStore(props: OverlayProps) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new OverlayStore(props, forceUpdate))
}
