export type ContainerType = HTMLElement | false | null
// false 时, 视为使用 document.body

export type GetContainerType = string | ContainerType | (() => ContainerType)

export interface OverlayProps {
  /** 自定义容器,会执行多次 为 false 时表示不适用 portal */
  container?: GetContainerType

  children: React.ReactElement

  mask?: boolean

  open?: boolean

  lockScroll?: boolean

  transitions?: { mask?: string; content?: string }

  /**
   * @zh 永远会渲染在页面
   * @default false
   */
  keepMounted?: boolean

  unmountOnClose?: boolean

  classNames?: { root?: string; mask?: string; wrap?: string }
}
