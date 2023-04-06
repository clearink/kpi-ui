type AnyFunction = (...args: any[]) => any

// const noop = <T>(any: T): T => any

export default class SubscriptionManager<Handler extends AnyFunction = any> {
  private subscriptions = new Set<Handler>()

  get size() {
    return this.subscriptions.size
  }

  add(handler: Handler): () => void {
    this.subscriptions.add(handler)

    return () => this.subscriptions.delete(handler)
  }

  notify(...args: Parameters<Handler>) {
    if (!this.size) return

    this.subscriptions.forEach((handler) => handler && handler(...args))
  }

  clear() {
    this.subscriptions.clear()
  }
}
