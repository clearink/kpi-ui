export const frameData = {
  delta: 1000 / 60,
}

export const measureFrameDelta = (() => {
  let timestamp = 0
  let measured = false

  return (t: number) => {
    if (measured) return

    // eslint-disable-next-line no-return-assign, no-sequences
    if (!timestamp) return (timestamp = t), undefined

    measured = true

    frameData.delta = t - timestamp
  }
})()
