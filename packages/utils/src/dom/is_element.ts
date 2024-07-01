export function isElement(node: any): node is HTMLElement | SVGElement {
  return node instanceof HTMLElement || node instanceof SVGElement
}
