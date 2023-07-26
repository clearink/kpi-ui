import { pushItem } from '@kpi/shared'

// padding margin width radius
const sides = ['Top', 'Right', 'Bottom', 'Left']

const props = ['padding', 'margin']
  .reduce((result: string[], prop) => {
    const items = sides.map((side) => `${prop}${side}`)
    return pushItem(result, items)
  }, [])
  .concat(
    sides.map((side) => `border${side}Width`),
    [
      `${sides[0]}${sides[3]}`,
      `${sides[0]}${sides[1]}`,
      `${sides[2]}${sides[1]}`,
      `${sides[2]}${sides[3]}`,
    ].map((side) => `border${side}Radius`)
  )

const set = new Set(['borderRadius', 'borderWidth', 'margin', 'padding'])

// 速记属性
export default {
  test: (v: string) => set.has(v),
}
