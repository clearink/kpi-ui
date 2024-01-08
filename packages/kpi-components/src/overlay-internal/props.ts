export type ContainerType = Element | DocumentFragment | null | undefined

export type GetContainerType = string | ContainerType | (() => ContainerType)

export interface OverlayProps {
  container?: GetContainerType

  children?: React.ReactNode

  open?: boolean

  lockScreen?: boolean

  destroyOnClose?: boolean

  motion?: string
}
