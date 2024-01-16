export type ContainerType = HTMLElement | false | null
// false 时, 视为使用 document.body

export type GetContainerType = string | ContainerType | (() => ContainerType)

export interface OverlayProps {
  /** 自定义容器,会执行多次 为 false 时表示不适用 portal */
  container?: GetContainerType

  children: React.ReactElement

  mask?: boolean

  open?: boolean

  transitions?: { mask?: string; content?: string }

  keepMounted?: boolean

  unmountOnExit?: boolean

  classNames?: { root?: string; mask?: string; wrap?: string }

  onBeforeOpen?: () => void

  onOpen?: () => void

  onAfterOpen?: () => void

  onBeforeClose?: () => void

  onClose?: () => void

  onAfterClose?: () => void
}
