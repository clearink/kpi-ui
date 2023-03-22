import { clamp } from '../utils'

function steps(nums = 10) {
  return (t: number) => Math.ceil(clamp(t, 0.000001, 1) * nums) * (1 / nums)
}

export default steps
