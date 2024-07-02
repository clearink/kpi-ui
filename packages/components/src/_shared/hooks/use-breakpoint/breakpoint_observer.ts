import { isFunction } from '@kpi-ui/utils'

import { BREAKPOINT_MAP, INIT_MATCHES, type ScreenMatch } from './breakpoint'

class BreakpointObserver {
  private dispatch = (e: MediaQueryListEvent) => {
    const breakpoint = BREAKPOINT_MAP.get(e.media)
    if (breakpoint && this.matches[breakpoint] !== e.matches) {
      this.matches[breakpoint] = e.matches
      this.listeners.forEach(handler => handler({ ...this.matches }))
    }
  }

  // 订阅事件
  private listeners = new Set<(e: ScreenMatch<boolean>) => void>()

  // 断点响应值
  private matches = { ...INIT_MATCHES }

  private queryList: MediaQueryList[] = []

  private register = () => {
    if (!window || !isFunction(window.matchMedia)) return

    BREAKPOINT_MAP.forEach((breakpoint, query) => {
      const mediaQueryList = window.matchMedia(query)

      mediaQueryList.addEventListener('change', this.dispatch)

      this.matches[breakpoint] = mediaQueryList.matches

      this.queryList.push(mediaQueryList)
    })
  }

  private unregister = () => {
    this.queryList.forEach((mediaQueryList) => {
      mediaQueryList.removeEventListener('change', this.dispatch)
    })

    this.queryList = []
  }

  public getCurrentMatches = () => ({ ...this.matches })

  public subscribe = (handler: (e: ScreenMatch<boolean>) => void) => {
    if (!this.listeners.size) this.register()

    this.listeners.add(handler)

    handler({ ...this.matches })

    return () => {
      this.listeners.delete(handler)
      if (!this.listeners.size) this.unregister()
    }
  }
}

export default new BreakpointObserver()
