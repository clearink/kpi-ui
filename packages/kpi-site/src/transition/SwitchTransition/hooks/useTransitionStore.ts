import { useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, isValidElement, ReactElement } from 'react'

import type { CSSTransitionProps as CSS } from '../../CSSTransition/props'
import { SwitchTransitionProps } from '../props'

class TransitionStore {
  constructor(public forceUpdate: () => void, instance: SwitchTransitionProps['children']) {
    if (isValidElement(instance)) this.instance = cloneElement(instance, { when: true })
  }

  /** 记录当前子组件实例 */
  instance: ReactElement<CSS> | null = null

  setInstance(instance: ReactElement<CSS> | null) {
    this.instance = instance
  }

  /** 记录当前切换状态 */
  status: 'ENTERING' | 'EXITING' | 'ENTERED' = 'ENTERED'

  /** 记录切换子组件时产生的副作用 */

  private $switchCleanup = null

  runSwitchCleanup = () => {
    this.$switchCleanup = null
  }
}
export default function useTransitionStore(children: SwitchTransitionProps['children']) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, children))
}
