import { useDeepMemo, useIsomorphicEffect } from '@kpi/shared'
import { createElement } from 'react'

import type { MotionProps } from './props'

export default function Motion(props: MotionProps) {
  const { tag = 'div', children, style } = props

  const memoizedStyle = useDeepMemo(() => style || {}, [style])

  useIsomorphicEffect(() => {
    // 过滤 style 中 所有的 motionValue
    // 向其添加update 事件用来更新 style
    // const cancels = Object.entries(memoizedStyle).reduce((result, [property, keyframeTarget]) => {
    //   return result
    // }, [])
    // return () => cancels.forEach((cancel) => cancel())
  }, [memoizedStyle])

  return createElement(tag, {}, children)
}
