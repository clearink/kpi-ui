export const frameData = { delta: 1000 / 60 }

// 上一次的时间戳
let timestamp = 0
export const updateFrameDelta = (t: number, ...args: any[]) => {
  if (timestamp) frameData.delta = t - timestamp

  timestamp = t
}
