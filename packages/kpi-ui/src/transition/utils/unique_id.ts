// TODO: 移到外面
export default function uniqueId(prefix = '') {
  let id = 0
  return () => `${prefix}${id++}`
}
