import each from './each'

export default function flush<K, V>(queue: Map<K, V>, iterator: (entry: [K, V]) => void): void
export default function flush<V>(queue: Set<V>, iterator: (value: V) => void): void
export default function flush(queue: any, iterator: any) {
  if (!queue.size) return
  const items = Array.from(queue)
  queue.clear()
  each(items, iterator)
}
