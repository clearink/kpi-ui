// utils
import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { omit } from '@kpi-ui/utils'
import { ReactElement, cloneElement, createElement } from 'react'
import { batch } from '../../../_shared/utils'
import { isEntered, isExit, isExited } from '../../../constants'
import runCounter from '../../../utils/run_counter'
import makeUniqueId from '../../../utils/unique_id'
// comps
import CSSTransition from '../../css-transition'
// types
import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

const uniqueId = makeUniqueId('st-')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Switch<E>) {
    this.props = props

    this.current = props.children

    this.elements = [this.make(this.current, { when: true })]
  }

  props: Switch<E>

  current: ReactElement

  elements: ReactElement[] = []

  components = new Map<ReactElement['key'], CSSTransitionRef>()

  get renderNodes() {
    const { mode, children } = this.props

    const len = this.elements.length

    if (mode === 'out-in') {
      return this.elements.map((el) => {
        const instance = this.components.get(el.key)

        if (!instance) return el

        if (instance.status === 3) return el
        console.log(instance.status, instance.instance)
        return el //cloneElement(el, undefined, children)
      })
    }

    if (mode === 'in-out') {
      return this.elements.map((el, index) => {
        return el
      })
    }

    return this.elements.map((el, index) => {
      if (index === 0 && len === 2) return el
      return cloneElement(el, undefined, children)
    })
  }

  setTransitionProps = (props: Switch<E>) => {
    this.props = props
  }

  make = (element: ReactElement, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['mode', 'children']) as CSS

    const key = uniqueId()

    const ref = (instance: CSSTransitionRef | null) => {
      if (!instance) this.components.delete(key)
      else this.components.set(key, instance)
    }

    Object.assign(preset, extra, { key, ref })

    return createElement(CSSTransition, preset, element)
  }

  runOutInSwitch = () => {
    this.elements = [
      cloneElement(this.elements[0], {
        when: false,
        appear: true,
        onExited: batch(this.props.onExited, () => {
          this.current = this.props.children

          this.elements = [this.make(this.current, { when: true, appear: true })]

          this.forceUpdate()
        }),
      }),
    ]
  }

  runInOutSwitch = () => {
    this.current = this.props.children

    this.elements = [
      cloneElement(this.elements[1] || this.elements[0], {
        onEntered: this.props.onEntered,
        onExited: this.props.onExited,
      }),
      this.make(this.current, {
        when: true,
        appear: true,
        onEntered: batch(this.props.onEntered, () => {
          this.elements = [
            cloneElement(this.elements[0], {
              when: false,
              onExited: batch(this.props.onExited, () => {
                this.elements = [this.elements[1]]
                this.forceUpdate()
              }),
            }),
            this.elements[1],
          ]
          this.forceUpdate()
        }),
      }),
    ]
  }

  runDefaultSwitch = () => {
    this.current = this.props.children

    const resolve = runCounter(2, () => {
      this.elements = [this.elements[1]]
      this.forceUpdate()
    })

    this.elements = [
      cloneElement(this.elements[1] || this.elements[0], {
        when: false,
        appear: true,
        onEntered: this.props.onEntered,
        onExited: batch(this.props.onExited, resolve),
      }),
      this.make(this.current, {
        when: true,
        appear: true,
        onEntered: batch(this.props.onEntered, resolve),
      }),
    ]
  }
}
export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Switch<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
