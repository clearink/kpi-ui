/** 用来设置元素样式的 */
export default abstract class Renderer {
  protected abstract readonly name: string

  public abstract test: (property: string) => boolean

  public render = (element: HTMLElement | SVGElement) => {
    // element[this.name] = ???
  }
}
