// utils
import { useConstant, useDerivedState, useForceUpdate } from '@kpi-ui/hooks'
import { isExited } from '../../../_shared/constants'
// types
import type { CSSTransitionRef } from '../../transition/_shared/props'
import type { OverlayProps } from '../props'

export class OverlayStore {
  // 能否挂载元素
  isMounted: boolean

  setIsMounted = (value: boolean, forceUpdate = true) => {
    if (this.isMounted !== value && forceUpdate) this.forceUpdate()

    this.isMounted = value
  }

  wrap = {
    current: null as HTMLDivElement | null,
    show: () => {
      const el = this.wrap.current
      el && el.style.removeProperty('display')
    },
    hide: () => {
      const el = this.wrap.current
      el && el.style.setProperty('display', 'none', 'important')
    },
  }

  content = {
    current: null as CSSTransitionRef | null,
  }

  get isExited() {
    const el = this.content.current
    return el && isExited(el.status)
  }

  constructor(props: OverlayProps, public forceUpdate: () => void) {
    this.isMounted = !!props.keepMounted
  }
}

export default function useOverlayStore(props: OverlayProps) {
  const { keepMounted, unmountOnExit, open } = props

  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new OverlayStore(props, forceUpdate))

  // 监听 keepMounted, unmountOnExit
  useDerivedState(`${keepMounted}-${unmountOnExit}`, () => {
    // keepMounted 优先级高于 unmountOnExit
    if (keepMounted) store.setIsMounted(true)
    else if (unmountOnExit && store.isExited) store.setIsMounted(false)
  })

  // when 变化时需要保证页面处于渲染中, 不必强制渲染一次更新 isMounted
  useDerivedState(open, () => store.setIsMounted(true, false))

  return store
}
