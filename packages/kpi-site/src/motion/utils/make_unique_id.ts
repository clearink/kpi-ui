/* eslint-disable no-return-assign */

export default function makeUniqueId<T>(
  initial: T,
  mutation = (val: T) => ((val as number) + 1) as T
) {
  let value = initial

  return () => (value = mutation(value))
}
