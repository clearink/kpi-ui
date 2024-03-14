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
