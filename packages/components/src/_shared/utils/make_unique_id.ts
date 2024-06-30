export function makeUniqueId(prefix = '') {
  let id = 0
  return () => `${prefix}${id++}`
}
