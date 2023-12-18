export function nextFrame(callback: () => void) {
  const ids: number[] = Array(2)

  ids[0] = requestAnimationFrame(() => {
    ids[1] = requestAnimationFrame(callback)
  })

  return () => ids.forEach(cancelAnimationFrame)
}
