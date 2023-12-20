export interface ModalProps {
  open?: boolean
  beforeClose?: () => void
  afterClose?: () => void
  beforeOpen?: () => void
  afterOpen?: () => void
}
