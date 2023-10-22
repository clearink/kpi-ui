import { useWatch } from '@kpi/shared'
import { Fragment, createElement } from 'react'
import useTransitionStore from './hooks/use_transition_store'
import isSameElement from './utils/same'

import type { SwitchTransitionProps } from './props'

// 转场动画
export default function SwitchTransition(props: SwitchTransitionProps) {
  const { children, mode } = props

  const store = useTransitionStore(props)

  // 更新 store 中保存的数据
  store.updateProps(props)

  const shouldTransition = !isSameElement(store.current, children)

  useWatch(shouldTransition, () => {
    if (!shouldTransition) return

    if (mode === 'out-in') store.startOutIn()
    else if (mode === 'in-out') store.startInOut()
    else store.startDefault()
  })

  return createElement(Fragment, undefined, store.elements)
}
