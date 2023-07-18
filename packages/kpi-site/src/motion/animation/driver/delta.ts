/* eslint-disable @typescript-eslint/no-unused-vars */
let timestamp = 0

export const frameData = { delta: 1000 / 60, lagged: () => frameData.delta * 2 }

export const updateFrameDelta = (t: number, ...args: any[]) => {
  const delta = t - timestamp

  // 保证在偏差以内
  if (timestamp && delta < frameData.lagged()) frameData.delta = delta

  timestamp = t
}
