import { useConstant } from '@kpi-ui/hooks'

import type { OverlayProps } from '../props'

export class OverlayStore {
  // 是否应该渲染
  shouldRender = false

  setShouldRender = (value: boolean) => {
    this.shouldRender = value
  }

  inTransition = false

  setInTransition = (value: boolean) => {
    this.inTransition = value
  }

  // 组件是否渲染过
  isInitial = true

  setIsInitial = (value: boolean) => {
    this.isInitial = value
  }

  constructor(props: OverlayProps) {
    this.shouldRender = !!props.open
  }
}

export default function useOverlayStore(props: OverlayProps) {
  return useConstant(() => new OverlayStore(props))
}
