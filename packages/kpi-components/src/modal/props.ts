import { OverlayProps } from '../_internal/overlay/props'

export interface ModalProps extends OverlayProps {
  beforeClose?: () => void

  afterClose?: () => void

  beforeOpen?: () => void

  afterOpen?: () => void

  onOpenChange?: (open: boolean) => void
}
