export type GetContainerType = string | null | (() => Element | DocumentFragment | null)

export interface PortalProps {
  getContainer?: GetContainerType

  children?: React.ReactNode

  open?: boolean

  lockScreen?: boolean

  destroyOnClose?: boolean
}
