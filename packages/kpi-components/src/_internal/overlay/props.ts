import type { PortalProps } from '../portal/props'

export interface OverlayProps extends Pick<PortalProps, 'getContainer'> {
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
