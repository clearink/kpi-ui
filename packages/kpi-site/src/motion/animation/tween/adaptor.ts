export class HtmlAdaptor {
  constructor(private element: HTMLElement) {}

  // toTween = () => {
  //   return valueTween()
  // }
}

export const htmlAdaptor = (element: HTMLElement) => {
  return new HtmlAdaptor(element)
}
