export function getElementCoords(el: Element) {
  return {
    el,
    coords: el.getBoundingClientRect(),
    height: el.clientHeight,
    width: el.clientWidth,
  }
}

export const defaultArrowCoords = {}
