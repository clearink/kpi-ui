import { BREAKPOINT, INIT_MATCHES, ScreenMatch } from '../../_shard/constant'

export default class MediaObserver {
  private listeners: MediaQueryList[] = [] // 记录所有的 QueryList 对象

  private breakpointMap: Map<string, string> = new Map() // 方便找到相应的速记值

  private queryHandler: (e: MediaQueryListEvent) => void // 内部扩展的触发函数

  private currentMatches = { ...INIT_MATCHES } // 当前匹配值

  constructor(handler: (e: ScreenMatch) => void) {
    this.queryHandler = this.extendHandler(handler)

    for (const [breakpoint, { size, mode }] of Object.entries(BREAKPOINT)) {
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
  private extendHandler(handler: (e: ScreenMatch) => void) {
    // 闭包 只在 currentMatches 变化时调用 handler 函数
    return (e: MediaQueryListEvent) => {
      const breakpoint = this.breakpointMap.get(e.media)
      if (breakpoint && this.currentMatches[breakpoint] !== e.matches) {
        this.currentMatches[breakpoint] = e.matches // 更新值
        handler({ ...this.currentMatches }) // 改变引用
      }
    }
  }

  public unsubscribe() {
    for (const listener of this.listeners) {
      listener.removeEventListener('change', this.queryHandler)
    }
    this.listeners = []
  }
}
