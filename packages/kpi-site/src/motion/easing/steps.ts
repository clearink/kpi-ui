import clamp from '../utils/clamp'

function steps(frames = 10) {
  return (t: number) => Math.ceil(clamp(t, 0.000001, 1) * frames) * (1 / frames)
}

export default steps
