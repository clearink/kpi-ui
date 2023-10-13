import { useConstant, useForceUpdate } from '@kpi/shared'
import { isValidElement } from 'react'

import type { SwitchTransitionProps } from '../props'

class TransitionStore {
  constructor(public forceUpdate: () => void) {}

  /** 记录当前子组件实例 */
  nodeList: SwitchTransitionProps['children'][] = []

  get current() {
    return this.nodeList[0] || null
  }

  /** 记录当前切换状态 */
  status: 'ENTERING' | 'EXITING' | 'ENTERED' = 'ENTERED'

  running = false

  /** 记录切换子组件时产生的副作用 */

  private $switchCleanup = null

  runSwitchCleanup = () => {
    this.$switchCleanup = null
  }
}
export default function useTransitionStore(children: SwitchTransitionProps['children']) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => {
    const store = new TransitionStore(forceUpdate)

    if (isValidElement(children)) store.nodeList.push(children)

    return store
  })
}
