import { isExited } from '@comps/_shared/constants'
import { useConstant, useForceUpdate, useWatchValue } from '@comps/_shared/hooks'
import { useMemo } from 'react'

import type { CSSTransitionRef as CSSRef } from '../../transition/_shared/props'
import type { OverlayProps } from '../props'

export class OverlayState {
  $content = {
    current: null as CSSRef | null,
  }

  // 能否挂载元素
  isMounted: boolean

  constructor(props: OverlayProps) {
    this.isMounted = !!props.keepMounted || !!props.open
  }
}

export class OverlayAction {
  setIsMounted = (value: boolean) => {
    if (this.states.isMounted !== value) this.forceUpdate()

    this.states.isMounted = value
  }

  constructor(
    private forceUpdate: () => void,
    private states: OverlayState,
  ) {}

  get isExited() {
    const el = this.states.$content.current
    return el && isExited(el.status)
  }
}

export default function useOverlayStore(props: OverlayProps) {
  const { keepMounted, open, unmountOnExit } = props

  const update = useForceUpdate()

  const states = useConstant(() => new OverlayState(props))

  const actions = useMemo(() => new OverlayAction(update, states), [update, states])

  // 监听 keepMounted, unmountOnExit
  const returnEarly1 = useWatchValue(`${keepMounted}-${unmountOnExit}`, () => {
    // keepMounted 优先级高于 unmountOnExit
    let isMounted = states.isMounted

    if (keepMounted) isMounted = true
    else if (unmountOnExit && actions.isExited) isMounted = false

    actions.setIsMounted(isMounted)

    return states.isMounted !== isMounted
  })

  // when 变化时需要保证页面处于渲染中,

  const returnEarly2 = useWatchValue(open, () => {
    actions.setIsMounted(true)

    return states.isMounted !== true
  })

  return { returnEarly: returnEarly1 || returnEarly2, actions, states }
}
