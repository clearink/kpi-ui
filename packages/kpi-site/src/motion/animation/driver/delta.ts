/* eslint-disable @typescript-eslint/no-unused-vars */
export const frameData = { delta: 1000 / 60, timestamp: 0 }

export const updateFrameDelta = (t: number, ...params: any[]) => {
  const delta = t - frameData.timestamp

  // 保证在偏差以内
  if (frameData.timestamp && delta < frameData.delta * 2) frameData.delta = delta
}
