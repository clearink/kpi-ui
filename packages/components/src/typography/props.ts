import type { ReactNode } from 'react'

interface CopyableConfig {
  icon?: ReactNode
  onCopy?: () => void
  text?: string
  tooltips?: ReactNode | false
}
interface EditableConfig {}
interface EllipsisConfig {}

export interface TypographyBaseProps {
  code?: boolean
  copyable?: CopyableConfig | boolean
  delete?: boolean
  disabled?: boolean
  editable?: EditableConfig | boolean
  ellipsis?: EllipsisConfig | boolean
  italic?: boolean
  mark?: boolean
  onClick?: (event: MouseEvent) => void
  strong?: boolean
  type?: 'danger' | 'secondary' | 'success' | 'warning'
  underline?: boolean
}

export interface TextProps extends TypographyBaseProps {
  children?: ReactNode
}
