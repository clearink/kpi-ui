import { omit, useDerivedState } from '@kpi/shared'
import { Children, Fragment, createElement } from 'react'
import SwitchTransition from '../switch-transition'
import useTransitionStore from './hooks/use_transition_store'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { children } = props

  const store = useTransitionStore()

  const cssProps = omit(props, ['children', 'when', 'unmountOnExit', 'appear'])

  // 以 CSSTransition 实现 还是 以 SwitchTransition ?

  // const elements = Children.map(children, (child) => (
  //   <SwitchTransition<E> mode="out-in" {...cssProps} key={child.key} appear>
  //     {child}
  //   </SwitchTransition>
  // ))

  // 使用 FLIP

  // 首先需要 diff 出进入，退出的动画
  const elements = children
  console.log(elements)

  // 除非前后元素一致, 否则需要进行过渡
  const shouldTransition = true
  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    console.log('should run change')
  })

  return createElement(Fragment, undefined, elements)
}
