import { useConstant, useForceUpdate } from '@kpi/shared'
import { CSSTransitionProps } from '../props'

class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSSTransitionProps<E>) {
    const { appear, when, unmountOnExit } = props

    this.appear = !!appear

    this.unmount = !!unmountOnExit && !when
  }

  appear: boolean

  unmount: boolean

  instance: E | null = null

  isInitial = true

  running = false

  endHook: void | (() => void) = undefined

  runEndHook = () => {
    this.endHook && this.endHook()

    this.endHook = undefined
  }

  hidden = () => {
    const el = this.instance

    if (!el) return

    el.dataset.display = el.style.getPropertyValue('display')
    el.dataset.priority = el.style.getPropertyPriority('display')
    el.style.display = 'none'
  }

  show = () => {
    const el = this.instance

    if (!el) return

    const value = el.dataset.display || ''
    const priority = el.dataset.priority || ''

    el.style.setProperty('display', value, priority)
  }

  destroy = () => {
    this.unmount = true

    this.instance = null

    this.forceUpdate()
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSSTransitionProps<E>) {
  const update = useForceUpdate()

  return useConstant(() => new TransitionStore<E>(update, props))
}
