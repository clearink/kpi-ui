export default function nextTick(callback: () => void) {
  const id = requestAnimationFrame(callback)

  return () => cancelAnimationFrame(id)
}
