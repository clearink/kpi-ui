import { cloneElement, ReactElement } from 'react'
import batch from '../../css-transition/utils/batch'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchMode } from '../props'

export default function scheduler<C extends ReactElement<CSS>>(
  current: C,
  next: C,
  mode?: SwitchMode
) {
  if (mode === 'in-out') {
    return [
      current,
      cloneElement(next, {
        when: true,
        onEntered: batch(next.props.onEntered, () => {
          // 结束时需要执行 current.exit
        }),
      }),
    ]
  }

  if (mode === 'out-in') {
    return [
      cloneElement(current, {
        when: false,
        onExited: batch(current.props.onExited, () => {
          // 结束时需要删除自身 并且 执行 next.enter
        }),
      }),
    ]
  }

  return [
    cloneElement(current, {
      when: false,
      onExited: batch(current.props.onExited, () => {
        // updateCurrent(cloneElement(next, { when: true }))
      }),
    }),
    cloneElement(next, { when: true }),
  ]
}
