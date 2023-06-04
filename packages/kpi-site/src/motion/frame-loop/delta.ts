/* eslint-disable no-return-assign */
export const frameData = { delta: 1000 / 60 }

let timestamp = 0

export const updateFrameDelta = (t: number, ...args: any[]) => {
  const double = frameData.delta * 2

  if (timestamp && t - timestamp < double) frameData.delta = t - timestamp

  timestamp = t
}
