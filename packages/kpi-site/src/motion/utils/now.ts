const now = (() => {
  if (typeof performance !== 'undefined') return () => performance.now()

  if (typeof Date.now === 'function') return () => Date.now()

  return () => new Date().getTime()
})()
export default now
