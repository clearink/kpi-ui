function uniqueId(prefix: string) {
  let id = 0
  return () => `${prefix}-${id++}`
}

export default uniqueId('switch-transition-key')
