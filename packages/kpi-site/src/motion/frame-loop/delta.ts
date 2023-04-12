export const frameData = { delta: 1000 / 60 }

// 上一次的时间戳
let timestamp = 0
export const updateFrameDelta = (t: number, ...args: any[]) => {
  timestamp = timestamp ? Math.min(timestamp, t) : t

  frameData.delta = t - timestamp || frameData.delta
}
