// utils
import { useConstant, useForceUpdate, useWatchValue } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import { isExited } from '../../../_shared/constants'
// types
import type { CSSTransitionRef as CSSRef } from '../../transition/_shared/props'
import type { OverlayProps } from '../props'

export class OverlayState {
  constructor(props: OverlayProps, public forceUpdate: () => void) {
    this.isMounted = !!props.keepMounted || !!props.open
  }

  // 能否挂载元素
  isMounted: boolean

  $content = {
    current: null as CSSRef | null,
  }
}

export class OverlayAction {
  constructor(private forceUpdate: () => void, private states: OverlayState) {}

  get isExited() {
    const el = this.states.$content.current
    return el && isExited(el.status)
  }

  setIsMounted = (value: boolean) => {
    if (this.states.isMounted !== value) this.forceUpdate()

    this.states.isMounted = value
  }
}

export default function useOverlayStore(props: OverlayProps) {
  const { keepMounted, unmountOnExit, open } = props

  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new OverlayState(props, forceUpdate))

  const actions = useMemo(() => new OverlayAction(forceUpdate, states), [forceUpdate, states])

  let returnEarly = false

  // 监听 keepMounted, unmountOnExit
  useWatchValue(`${keepMounted}-${unmountOnExit}`, () => {
    // keepMounted 优先级高于 unmountOnExit
    let isMounted = states.isMounted

    if (keepMounted) isMounted = true
    else if (unmountOnExit && actions.isExited) isMounted = false

    returnEarly = states.isMounted !== isMounted

    actions.setIsMounted(isMounted)
  })

  // when 变化时需要保证页面处于渲染中,
  useWatchValue(open, () => {
    returnEarly = states.isMounted !== true

    actions.setIsMounted(true)
  })

  return { states, actions, returnEarly }
}
