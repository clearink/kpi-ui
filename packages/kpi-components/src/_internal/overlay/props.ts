export type ContainerType = HTMLElement | false | null
// false 时, 视为使用 document.body

export type GetContainerType = string | ContainerType | (() => ContainerType)

export interface OverlayProps {
  /** 自定义容器,会执行多次 为 false 时表示不适用 portal */
  container?: GetContainerType

  children: React.ReactElement

  mask?: boolean

  open?: boolean

  lockScreen?: boolean

  transitions?: { mask?: string; content?: string }

  /**
   * @zh 进入过渡时才进行初次渲染
   * @default false
   */
  mountOnEnter?: boolean

  /**
   * @zh 退出过渡结束时卸载元素
   * @default false
   */
  unmountOnExit?: boolean

  classNames?: { root?: string; mask?: string; wrap?: string }
}
