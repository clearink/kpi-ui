export default function isCoords(value?: HTMLElement | DOMRect): value is DOMRect {
  return value instanceof DOMRect
}
