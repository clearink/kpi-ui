import { hasOwn } from '@kpi-ui/utils'

import { BREAKPOINT_NAME, type ScreenMatch } from './breakpoint'

// 匹配相应的断点数据
export function matchBreakpoint<Q>(matches: ScreenMatch<boolean>, target: ScreenMatch<Q>) {
  for (let i = 0; i < BREAKPOINT_NAME.length; i += 1) {
    const point = BREAKPOINT_NAME[i]
    const matched = matches[point]

    if (!matched || !hasOwn(target, point)) continue

    return target[point]
  }
}
