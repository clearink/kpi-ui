export type Breakpoint = (typeof BREAKPOINT_NAME)[number]
export type ScreenMatch<K> = Partial<Record<Breakpoint, K>>

/* ----------------------------------- 公共常量 ----------------------------------- */

// 响应式断点
export const BREAKPOINT_NAME = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const

// 断点 TODO: 尝试可以配置
export const BREAKPOINT = {
  lg: { mode: 'min', size: 992 },
  md: { mode: 'min', size: 768 },
  sm: { mode: 'min', size: 576 },
  xl: { mode: 'min', size: 1200 },
  xs: { mode: 'max', size: 575 },
  xxl: { mode: 'min', size: 1600 },
} as const

// 默认断点匹配值
export const INIT_MATCHES = BREAKPOINT_NAME.reduce((res, name) => {
  res[name] = true
  return res
}, {})

// 方便找到相应的速记值
export const BREAKPOINT_MAP = Object.entries(BREAKPOINT).reduce(
  (map, [breakpoint, { mode, size }]) => {
    const query = `(${mode}-width: ${size}px)`
    return map.set(query, breakpoint)
  },
  new Map<string, string>(),
)
