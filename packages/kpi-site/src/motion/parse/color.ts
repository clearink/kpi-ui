// hex 编码
// rgb rgba 编码
// hsl 编码
/* eslint-disable no-multi-assign */

import { isString } from '@kpi/shared'

/* eslint-disable no-param-reassign */
export const isHexColor = (v: string) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(v)
export const isRgbColor = (v: string) => /^rgb/.test(v)
export const isHslColor = (v: string) => /^hsl/.test(v)
export const isColor = (v: string) => isHexColor(v) || isRgbColor(v) || isHslColor(v)

export const rgbToRgba = (v: string) => {
  const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(v)
  return rgb ? `rgba(${rgb[1]},1)` : v
}

export const hexToRgba = (v: string) => {
  const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const hex = v.replace(rgx, (m, r, g, b) => r + r + g + g + b + b)
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = parseInt(rgb?.[1] || '0', 16)
  const g = parseInt(rgb?.[2] || '0', 16)
  const b = parseInt(rgb?.[3] || '0', 16)
  return `rgba(${r},${g},${b},1)`
}

export const hslToRgba = (v: string) => {
  const hsl =
    /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(v) ||
    /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(v)
  const h = parseInt(hsl?.[1] || '0', 10) / 360
  const s = parseInt(hsl?.[2] || '0', 10) / 100
  const l = parseInt(hsl?.[3] || '0', 10) / 100
  const a = hsl?.[4] || 1
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r
  let g
  let b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `rgba(${r * 255},${g * 255},${b * 255},${a})`
}

export const colorToRgba = (v: string) => {
  if (isRgbColor(v)) return rgbToRgba(v)
  if (isHexColor(v)) return hexToRgba(v)
  if (isHslColor(v)) return hslToRgba(v)

  return v
}

const color = {
  test: (v: any) => isString(v) && (isHexColor(v) || isRgbColor(v) || isHslColor(v)),
  parse: () => {},
  transform: () => {},
}
export default color

/**
 * <Motion tag="div" from={{x:0,y:100}} enter={{x:'100%', y:0, color: '#f00'}} leave={{x:0,y:100}}>
 *  1212631212423482342367
 * </Motion>
 * => 会创建出怎样的 motion 对象呢?
 * const enterPropMotions = [
 * {
 *    type: 'transform',
 *    property: 'x',
 *    original: 0,
 *    easing: EasingFunction,
 *    start: 123.23,
 *    end: 2123.23,
 *    duration: 1500,
 *    delay: 500,
 *    from: { unit: '%', original: 0, transform:()=>{} },
 *    to: { unit: '%',original: '100%', transform:()=>{} }
 * },
 * {
 *    type: 'transform',
 *    property: 'y',
 *    original: 0,
 *    easing: EasingFunction,
 *    start: 123.23,
 *    end: 2123.23,
 *    duration: 1500,
 *    delay: 500,
 *    from: {unit: '', original: 100, transform:()=>{} },
 *    to: { unit: '',original: 0, transform:()=>{} }
 * },
 * {
 *    type: 'style',
 *    property: 'color',
 *    easing: EasingFunction,
 *    start: 123.23,
 *    end: 2123.23,
 *    duration: 1500,
 *    delay: 500,
 *    from: { original: undefined, transform:()=>{} },
 *    to: { original: '#ff0', transform:()=>{} }
 * },
 * ]
 */

/**
 * const value = useMotionValue(0)
 *
 * animate(value, 100)
 *
 * const propMotion = [
 * {
 *  type: 'value',
 *  property: never,
 *  easing: EasingFunction,
 *  start: 123.23,
 *  end: 2123.23,
 *  duration: 1500,
 *  delay: 500,
 *  from: {unit:'', original: 0, transform:()=>{}},
 *  to: {unit:'', original: 0, transform:()=>{}},
 * }
 * ]
 *
 * const value = useMotionValue(0)
 *
 * animate(value, '100%')
 *
 * const propMotion = [
 * {
 *  type: 'value',
 *  property: never,
 *  easing: EasingFunction,
 *  start: 123.23,
 *  end: 2123.23,
 *  duration: 1500,
 *  delay: 500,
 *  from: {unit:'%', original: 0, transform:()=>{}},
 *  to: {unit:'%', original: 0, transform:()=>{}},
 * }
 * ]
 */
