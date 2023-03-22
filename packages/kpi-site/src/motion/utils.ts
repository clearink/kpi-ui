export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
export const a = 1

export const now = (() => {
  if (typeof performance !== 'undefined') return () => performance.now()

  if (typeof Date.now === 'function') return () => Date.now()

  return () => new Date().getTime()
})()
