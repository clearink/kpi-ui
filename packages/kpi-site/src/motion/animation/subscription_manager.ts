type AnyFunction = (...args: any[]) => any

// const noop = <T>(any: T): T => any

export default class SubscriptionManager<Handler extends AnyFunction = any> {
  private subscriptions = new Set<Handler>()

  get size() {
    return this.subscriptions.size
  }

  add(hanlder: Handler) {
    this.subscriptions.add(hanlder)

    return () => this.subscriptions.delete(hanlder)
  }

  notify(...args: Parameters<Handler>) {
    if (!this.size) return

    this.subscriptions.forEach((handler) => handler && handler(...args))
  }

  clear() {
    this.subscriptions.clear()
  }
}
