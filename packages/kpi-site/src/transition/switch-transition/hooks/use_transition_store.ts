import { omit, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import runCounter from '../utils/run_counter'
import uniqueId from '../utils/unique_id'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    this.props = props

    this.current = props.children

    this.elements = [this.makeElement(this.current, { when: true })]
  }

  // 最新的 props, 传递给 CSSTransition 组件
  props: Switch<E>

  // 进行过渡之前的子元素
  current: ReactElement<CSS<E>>

  // 展示在页面上的子元素
  elements: ReactElement<CSS<E>>[] = []

  setTransitionProps = (props: Switch<E>) => {
    this.props = props
  }

  makeElement = (element: ReactElement<CSS<E>>, extra: Partial<CSS>) => {
    const preset = omit(this.props, ['mode', 'children'])

    Object.assign(preset, extra, { key: uniqueId() })

    return createElement(CSSTransition, preset as CSS, element)
  }

  runOutInSwitch = () => {
    this.elements = [
      cloneElement(this.elements[0] || this.current, {
        when: false,
        appear: true,
        onExited: batch(this.props.onExited, () => {
          this.current = this.props.children

          this.elements = [this.makeElement(this.current, { when: true, appear: true })]

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
      this.makeElement(this.current, {
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
      this.makeElement(this.current, {
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
