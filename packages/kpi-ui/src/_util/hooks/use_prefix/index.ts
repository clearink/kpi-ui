export default function usePrefix(name: string) {
  const prefix = 'kpi'
  return `${prefix}-${name}`
}
