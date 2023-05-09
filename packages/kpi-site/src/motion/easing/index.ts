/* eslint-disable no-param-reassign, no-return-assign */

import { easeOutToEaseIn } from './utils/modifiers'
import generateEasing from './utils/generate'

import type { EasingFunction } from './interface'

const linear: EasingFunction = (x) => x

const Sine = generateEasing('Sine', (x) => 1 - Math.cos((x * Math.PI) / 2))

const Quad = generateEasing('Quad', (x) => x ** 2)

const Cubic = generateEasing('Cubic', (x) => x ** 3)

const Quart = generateEasing('Quart', (x) => x ** 4)

const Quint = generateEasing('Quint', (x) => x ** 5)

const Expo = generateEasing('Expo', (x) => x ** 6)

const Circ = generateEasing('Circ', (x) => 1 - Math.sqrt(1 - x ** 2))

const c1 = 1.70158
const c3 = c1 + 1
const Back = generateEasing('Back', (x) => (x === 1 ? 1 : x * x * (c3 * x - c1)))

const n1 = 7.5625
const d1 = 2.75
const Bounce = generateEasing(
  'Bounce',
  easeOutToEaseIn((x) => {
    if (x < 1 / d1) return n1 * x * x
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  })
)

const c4 = (2 * Math.PI) / 3
const Elastic = generateEasing('Elastic', (x) => {
  return x === 0 || x === 1 ? x : -(2 ** (10 * x - 10)) * Math.sin((x * 10 - 10.75) * c4)
})

export const easings = {
  linear,
  ...Sine,
  ...Quad,
  ...Cubic,
  ...Quart,
  ...Quint,
  ...Expo,
  ...Circ,
  ...Back,
  ...Bounce,
  ...Elastic,
}

export { default as cubicBezier } from './cubic_bezier'
export { default as steps } from './steps'
