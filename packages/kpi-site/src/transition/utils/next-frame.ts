export default function nextFrame(callback: () => void) {
  const ids: number[] = []

  ids[0] = requestAnimationFrame(() => {
    ids[1] = requestAnimationFrame(callback)
  })

  return () => {
    ids.forEach(cancelAnimationFrame)
  }
}
