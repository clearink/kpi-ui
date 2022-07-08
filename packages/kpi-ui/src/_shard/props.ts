import { BREAKPOINT } from '@shard/constant'

// 公共类型
export type SizeType = 'small' | 'middle' | 'large'

export type Breakpoint = keyof typeof BREAKPOINT
export type BreakpointMap = Record<Breakpoint, string>
export type ScreenMatch = Partial<Record<Breakpoint, boolean>>

// 扩展方法
export type LiteralUnion<T extends U, U> = T | (U & {})
