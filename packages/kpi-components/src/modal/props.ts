export interface ModalProps {
  open?: boolean
  beforeClose: () => void
  afterClose: () => void
  onOpenChange: () => void
  beforeOpen: () => void
  afterOpen: () => void
}
