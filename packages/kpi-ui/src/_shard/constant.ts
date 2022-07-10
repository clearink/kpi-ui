/* ----------------------------------- 公共类型 ----------------------------------- */
export type SizeType = 'small' | 'middle' | 'large'
export type Breakpoint = typeof BREAKPOINT_NAME[number]
export type ScreenMatch = Partial<Record<Breakpoint, boolean>>
export type ScreenQuery<K extends any> = Partial<Record<Breakpoint, K>>

/* ----------------------------------- 公共常量 ----------------------------------- */
// component Space
export const SPACE_SIZE: Record<SizeType, number> = {
  small: 8,
  middle: 16,
  large: 24,
}

// 响应式断点
export const BREAKPOINT_NAME = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const

// 断点 TODO: 尝试可以配置
export const BREAKPOINT = {
  xs: { size: 575, mode: 'max' },
  sm: { size: 576, mode: 'min' },
  md: { size: 768, mode: 'min' },
  lg: { size: 992, mode: 'min' },
  xl: { size: 1200, mode: 'min' },
  xxl: { size: 1600, mode: 'min' },
} as const

export const INIT_MATCHES = BREAKPOINT_NAME.reduce(
  (res, name) => ({ ...res, [name]: false }),
  {} as ScreenMatch
)
