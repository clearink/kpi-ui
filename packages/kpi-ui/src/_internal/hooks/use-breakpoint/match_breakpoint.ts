import { hasOwn } from '@kpi/shared'
import { BREAKPOINT_NAME } from '../../constant'

import type { ScreenMatch } from '../../constant'

// 匹配相应的断点数据
export default function matchBreakpoint<Q extends unknown>(
  matches: ScreenMatch<boolean>,
  target: ScreenMatch<Q>
) {
  for (let i = 0; i < BREAKPOINT_NAME.length; i += 1) {
    const point = BREAKPOINT_NAME[i]
    const matched = matches[point]

    if (!matched || !hasOwn(target, point)) continue

    return target[point]
  }
}
