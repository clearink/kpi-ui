import { omit, useConstant, useForceUpdate } from '@kpi/shared'
import { Key, ReactElement, cloneElement, createElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import uniqueId from '../utils/unique_id'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

class TransitionStore {
  constructor(public forceUpdate: () => void, props: CSS) {
    this.props = props

    this.current = props.children

    this.elements = [this.makeElement(this.current, { when: true })]
  }

  // 进行过渡之前的子元素
  current: ReactElement<CSS>

  // 展示在页面上的子元素
  elements: ReactElement<CSS>[] = []

  // 最新的 props, 传递给 CSSTransition 组件
  props: Switch

  updateProps = (props: Switch) => {
    this.props = props
  }

  makeElement = (element: ReactElement<CSS>, extra: Partial<CSS> & { key?: Key | null }) => {
    const preset = omit(this.props, ['mode', 'children'])

    Object.assign(preset, { unmountOnExit: true, key: element.key }, extra)

    return createElement(CSSTransition, preset as CSS, element)
  }

  startOutIn = () => {
    this.elements = [
      cloneElement(this.elements[0] || this.current, {
        when: false,
        appear: true,
        onExited: batch(this.props.onExited, () => {
          this.current = this.props.children

          this.elements = [
            this.makeElement(this.current, {
              when: true,
              appear: true,
            }),
          ]

          this.forceUpdate()
        }),
      }),
    ]
  }

  startInOut = () => {
    this.current = this.props.children

    this.elements = [
      cloneElement(this.elements[1] || this.elements[0], {
        onEntered: undefined,
        onExited: undefined,
      }),
      this.makeElement(this.current, {
        when: true,
        appear: true,
        key: uniqueId(),
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

  startDefault = () => {
    this.current = this.props.children

    this.elements = [
      cloneElement(this.elements[1] || this.elements[0], {
        when: false,
        appear: true,
        onEntered: undefined,
      }),
      this.makeElement(this.current, {
        when: true,
        appear: true,
        key: uniqueId(),
        onEntered: batch(this.props.onEntered, () => {
          this.elements = [this.elements[1]]
          this.forceUpdate()
        }),
      }),
    ]
  }
}
export default function useTransitionStore(props: Switch) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
