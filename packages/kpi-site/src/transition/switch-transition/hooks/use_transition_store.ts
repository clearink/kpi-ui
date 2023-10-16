import { useConstant, useForceUpdate } from '@kpi/shared'
import { ReactElement, cloneElement, isValidElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

class TransitionStore {
  constructor(public forceUpdate: () => void) {}

  // 负责展示的元素
  elements: (ReactElement<CSS> | null)[] = []

  current: ReactElement<CSS> | null = null

  children: Switch['children'] | null = null

  updateChildren = (children: Switch['children'] | null) => {
    this.children = children
  }

  makeElement = (element: Switch['children'], when: boolean) => {
    if (!isValidElement(element)) return null

    // 子元素不是 CSSTransition 也不处理
    if (element.type !== CSSTransition) return null

    const props: Record<string, any> = { when }

    if (!this.initial) props.appear = true

    return cloneElement(element as ReactElement<CSS>, props)
  }

  /** 是否正在执行动画 */

  running = false

  start = () => {
    this.running = true
  }

  stop = () => {
    this.running = false
  }

  /** 是否为初始化 */

  initial = true

  setInitial = (val: boolean) => {
    this.initial = val
  }

  // TODO: 优化逻辑
  startOutIn = () => {
    this.start()

    const resolve = () => {
      if (isValidElement(this.children)) {
        this.current = this.makeElement(this.children, true)
        this.current = cloneElement(this.current!, {
          onEntering: batch(this.current!.props.onEntering, this.stop),
        })
      } else {
        this.stop()

        this.current = null
      }

      this.elements = [this.current]

      this.forceUpdate()
    }

    if (this.current) {
      this.elements = [
        cloneElement(this.current, {
          // 执行退场动画
          when: false,
          appear: true,
          onExited: batch(this.current.props.onExited, resolve),
        }),
      ]
    } else {
      this.stop()
      const a = this.makeElement(this.children, true)
      if (!a) this.elements = [a]
      else
        this.elements = [
          cloneElement(a, {
            onEntering: batch(a.props.onEntering, resolve),
          }),
        ]
    }
  }

  startInOut = () => {
    if (!this.children || !this.current) return
    this.start()
    // const resolve = () => {
    //   const resolve2 = () => {
    //     this.stop()
    //     if (!this.children) return
    //     this.current = this.makeElement(this.children, true)
    //     if (this.current) this.elements = [this.current]
    //     this.forceUpdate()
    //   }
    //   this.elements = [
    //     cloneElement(this.elements[0], {
    //       // 执行退场动画
    //       when: false,
    //       appear: true,
    //       onExited: batch(this.elements[0].props.onExited, resolve2),
    //     }),
    //     this.elements[1],
    //   ]
    //   this.forceUpdate()
    // }
    // this.elements = [
    //   this.current,
    //   cloneElement(this.children, {
    //     // 执行入场动画
    //     when: true,
    //     appear: true,
    //     onEntered: batch(this.children.props.onEntered, resolve),
    //   }),
    // ]
  }

  startBoth = () => {
    this.start()
  }
}
export default function useTransitionStore(props: Switch) {
  const { children } = props

  const forceUpdate = useForceUpdate()

  return useConstant(() => {
    const store = new TransitionStore(forceUpdate)

    store.current = store.makeElement(children, true)

    store.elements = [store.current]

    return store
  })
}
