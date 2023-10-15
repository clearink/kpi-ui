import useTransitionStore from './use_transition_store'
import isSameElement from '../utils/same'

import type { SwitchTransitionProps } from '../props'

export default function useCalculateChange(
  store: ReturnType<typeof useTransitionStore>,
  props: SwitchTransitionProps
) {
  const { children, mode } = props

  // 获取最新的子元素
  store.updateChildren(children)

  // 相同元素不处理
  if (isSameElement(store.current, children)) return

  // TODO: 解决 store.running 无法正确重置的问题
  if (mode === 'out-in' && !store.running) store.startOutIn()
  else if (mode === 'in-out') store.startInOut()
  else store.startBoth()
}
