export function atIndex<T>(array: T[], index: number) {
  const cursor = index >= 0 ? index : array.length + index
  return array[cursor]
}
