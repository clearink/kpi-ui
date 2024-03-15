import { ownerWindow } from '@kpi-ui/utils'
// types
import type { ResizeCallback } from '../props'

export class ObserverUtil {
  private _instance: ResizeObserver | null = null

  private _listeners = new Map<Element, Set<ResizeCallback>>()

  private _handleResize = () => {
    this._listeners.forEach((listeners, el) => {
      // prettier-ignore
      listeners.forEach((fn) => { fn(el) })
    })
  }

  private _addWindowResizeHandler = (el: Element) => {
    ownerWindow(el).addEventListener('resize', this._handleResize)
  }

  private _removeWindowResizeHandler = (el: Element) => {
    ownerWindow(el).removeEventListener('resize', this._handleResize)
  }

  private _getInstance() {
    if (typeof ResizeObserver === 'undefined') {
      throw new Error('not support ResizeObserver')
    }

    // prettier-ignore
    this._instance = this._instance || new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        // prettier-ignore
        this._listeners.get(target)?.forEach((fn) => { fn(target) })
      })
    })

    return this._instance
  }

  observe = (el: Element, callback: ResizeCallback) => {
    if (!this._listeners.size) this._addWindowResizeHandler(el)

    if (!this._listeners.has(el)) {
      this._listeners.set(el, new Set())

      this._getInstance().observe(el, { box: 'border-box' })
    }

    {
      const listener = this._listeners.get(el)
      listener && listener.add(callback)
    }

    return () => {
      const listener = this._listeners.get(el)

      listener && listener.delete(callback)

      if (listener && !listener.size) {
        this._listeners.delete(el)
        this._getInstance().unobserve(el)
      }

      if (!this._listeners.size) this._removeWindowResizeHandler(el)
    }
  }
}

export default new ObserverUtil().observe
