export default function unique<T extends any>(array: T[], getter?: (item: T) => any) {
  const callback = getter || ((item) => item)
  return array.reduce((result, item) => {
    if (!result.find((el) => callback(el) === callback(item))) result.push(item)
    return result
  }, [] as T[])
}
