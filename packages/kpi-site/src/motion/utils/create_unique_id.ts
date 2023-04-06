export default function createUniqueId<T>(init: T, mutation = (arg: T) => arg) {
  let value = init
  return function uniqueId() {
    value = mutation(value)

    return value
  }
}

createUniqueId(0, (v) => v + 2)
