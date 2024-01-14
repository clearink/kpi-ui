import { useConstant, useForceUpdate } from '@kpi-ui/hooks'

import type { OverlayProps } from '../props'

export class OverlayStore {
  // 过渡中
  inTransition = false

  setInTransition = (value: boolean) => {
    if (this.inTransition !== value) this.forceUpdate()

    this.inTransition = value
  }

  isInitial = true

  setIsInitial = (value: boolean) => {
    this.isInitial = value
  }

  constructor(props: OverlayProps, public forceUpdate: () => void) {
    this.isInitial = !props.open
  }
}

export default function useOverlayStore(props: OverlayProps) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new OverlayStore(props, forceUpdate))
}
