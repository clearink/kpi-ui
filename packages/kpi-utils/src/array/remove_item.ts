export function removeItem<T>(array: T[], value: T) {
  const index = array.indexOf(value)

  index > -1 && array.splice(index, 1)

  return array
}
