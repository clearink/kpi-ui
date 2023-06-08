/* eslint-disable @typescript-eslint/no-unused-vars */
const adjust = 1000 / 30
let timestamp = 0

export const frameData = { delta: 1000 / 60 }

export const updateFrameDelta = (t: number, ...args: any[]) => {
  const delta = t - timestamp

  // 保证在偏差以内
  if (timestamp && delta < adjust) frameData.delta = delta

  timestamp = t
}
