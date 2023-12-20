export type GetContainerType = string | null | (() => Element | DocumentFragment | null)

export interface OverlayProps {
  getContainer?: GetContainerType

  children?: React.ReactNode

  open?: boolean

  lockScreen?: boolean

  destroyOnClose?: boolean
}
