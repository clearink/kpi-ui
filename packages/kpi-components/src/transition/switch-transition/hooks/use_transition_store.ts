import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { withoutProperties } from '@kpi-ui/utils'
import { ReactElement, cloneElement, createElement } from 'react'
import { batch } from '../../_shared/utils'
import CSSTransition from '../../css-transition'
import runCounter from '../../utils/run_counter'
import makeUniqueId from '../../utils/unique_id'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

const uniqueId = makeUniqueId('st-')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    this.props = props

    this.current = props.children

    this.elements = [this.make(this.current, { when: true })]
  }

  props: Switch<E>

  current: ReactElement<CSS<E>>

  elements: ReactElement<CSS<E>>[] = []

  setTransitionProps = (props: Switch<E>) => {
    this.props = props
  }

  make = (element: ReactElement<CSS<E>>, extra: Partial<CSS<E>>) => {
    const preset = withoutProperties(this.props, ['mode', 'children']) as CSS

    Object.assign(preset, extra, { key: uniqueId() })

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
