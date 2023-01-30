const upperCase = (str: string) => str.toUpperCase()

export default function camelCase(name: string, pascal = false) {
  const normalized = name
    .replace(/(?<=[-_\s])(\w)/g, upperCase) /* 转换成大写 */
    .replace(/[-_\s]/g, '') /* 去除额外的符号 */
  return pascal ? normalized.replace(/^\w/g, upperCase) : normalized
}
