export function getElementCoords(el: Element) {
  const coords = el.getBoundingClientRect()

  return {
    left: coords.left,
    top: coords.top,
    height: coords.height,
    width: coords.width,
    clientHeight: el.clientHeight,
    clientWidth: el.clientWidth,
  }
}

export function getArrowCoords(
  el: Element | null,
  defaultCoords: ReturnType<typeof getElementCoords>
) {
  if (el) return getElementCoords(el)

  return { ...defaultCoords, height: 16, width: 16, clientHeight: 16, clientWidth: 16 }
}
