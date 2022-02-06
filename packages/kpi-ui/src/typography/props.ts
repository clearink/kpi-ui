import { ReactChild, ReactNode } from 'react'

interface CopyableConfig {
  icon?: ReactNode
  text?: string
  tooltips?: false | ReactNode
  onCopy?: () => void
}
interface EditableConfig {}
interface EllipsisConfig {}

export interface TypographyBaseProps {
  code?: boolean
  copyable?: boolean | CopyableConfig
  delete?: boolean
  disabled?: boolean
  editable?: boolean | EditableConfig
  ellipsis?: boolean | EllipsisConfig
  mark?: boolean
  onClick?: (event: MouseEvent) => void
  strong?: boolean
  italic?: boolean
  type?: 'secondary' | 'success' | 'warning' | 'danger'
  underline?: boolean
}

export interface TextProps extends TypographyBaseProps {
  children?: ReactChild
}
