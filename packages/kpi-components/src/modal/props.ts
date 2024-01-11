import { OverlayProps } from '../overlay-internal/props'

export interface ModalProps extends OverlayProps {
  beforeClose?: () => void

  afterClose?: () => void

  beforeOpen?: () => void

  afterOpen?: () => void
}
