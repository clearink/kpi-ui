export const frameData = {
  delta: 1000 / 60,
}

export const measureFrameInterval = (() => {
  let prev = 0
  let measured = false

  return (t: number) => {
    if (measured) return

    // eslint-disable-next-line no-return-assign
    if (!prev) return (prev = t)

    measured = true

    frameData.delta = t - prev
  }
})()
