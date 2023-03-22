export const getValueUnit = (value: string) => {
  const split =
    /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
      value
    )
  if (split) return split[1]
}

const arrayInclude = <T>(array: T[], item: T) => array.indexOf(item) > -1

export const convertPxToUnit = (el: HTMLElement, value: string, unit: string) => {
  const valueUnit = getValueUnit(value)
  if (arrayInclude([unit, 'deg', 'rad', 'turn'], valueUnit)) return value
}
