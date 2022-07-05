export default function usePrefix(name: string) {
  const prefix = 'kpi' // 将来可能会从 ConfigProvider 中获取
  return `${prefix}-${name}`
}
