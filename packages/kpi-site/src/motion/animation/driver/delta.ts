/* eslint-disable @typescript-eslint/no-unused-vars */
export const two = 1000 / 30

let timestamp = 0

export const frameData = { delta: two / 2, half: two / 4, two }

export const updateFrameDelta = (t: number, ...args: any[]) => {
  const delta = t - timestamp

  // 保证在偏差以内
  if (timestamp && delta < two) frameData.delta = delta

  timestamp = t
}
