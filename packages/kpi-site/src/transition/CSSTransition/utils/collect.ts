import { max } from '../../../motion/animation/utils/math'

const millisecond = (s: string) => (parseFloat(s) || 0) * 1e3

export default function collectTimeoutInfo(delays: string[], durations: string[]) {
  const len = delays.length

  const timeout = max(durations.map((d, i) => millisecond(d) + millisecond(delays[i % len])))

  return { timeout, count: durations.length }
}
