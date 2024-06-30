import type { CSSProperties, ReactNode } from 'react'

export interface CheckboxProps {
  autoFocus?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
}

export interface CheckboxOptionType {}
