import { BREAKPOINT_MAP } from '../../../_shared/constant'
import { BreakpointMapKeys } from '../../../_shared/props'

// 初始状态
export const initMatches = Object.keys(BREAKPOINT_MAP).reduce((res, cur) => ({ ...res, [cur]: false }), {}) as Record<
  BreakpointMapKeys,
  boolean
>
export default class MediaObserver {
  private listeners: MediaQueryList[] = [] // 记录所有的 QueryList 对象
  private breakpointMap: Map<string, string> = new Map() // 方便找到相应的速记值
  private queryHandler: (e: MediaQueryListEvent) => void // 内部扩展的触发函数
  private currentMatches = { ...initMatches } // 当前匹配值

  constructor(handler: (e: typeof initMatches) => void) {
    this.queryHandler = this.extendHandler(handler)

    for (const [breakpoint, { size, mode }] of Object.entries(BREAKPOINT_MAP)) {
      const query = `(${mode}-width: ${size}px)`
      this.breakpointMap.set(query, breakpoint)

      const queryList = window.matchMedia(query)
      queryList.addEventListener('change', this.queryHandler)
      this.currentMatches[breakpoint] = queryList.matches
      this.listeners.push(queryList)
    }
    handler({ ...this.currentMatches }) // 触发更新
  }

  // 扩展事件函数
  private extendHandler(handler: (e: typeof initMatches) => void) {
    // 闭包 只在 currentMatches 变化时调用 handler 函数
    return (e: MediaQueryListEvent) => {
      console.log(e);
      const breakpoint = this.breakpointMap.get(e.media)
      if (breakpoint && this.currentMatches[breakpoint] !== e.matches) {
        this.currentMatches[breakpoint] = e.matches // 更新值
        handler({ ...this.currentMatches }) // 改变引用
      }
    }
  }

  public unsubscribe() {
    for (let listener of this.listeners) {
      listener.removeEventListener('change', this.queryHandler)
    }
    this.listeners = []
  }
}
/**
 *   const queryList = window.matchMedia(responsiveMap.md)
    const handler = (e: MediaQueryListEvent) => console.log(e.matches)
    queryList.addEventListener('change', handler)
    console.log(queryList.matches)
    return () => queryList.removeEventListener('change', handler)
 */
