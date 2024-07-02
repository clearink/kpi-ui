import type { CSSProperties, ReactNode } from 'react'

export interface CheckboxProps {
  autoFocus?: boolean
  checked?: boolean
  children?: ReactNode
  className?: string
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  style?: CSSProperties
}

export interface CheckboxOptionType {}
