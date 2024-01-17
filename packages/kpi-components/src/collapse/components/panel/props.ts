import type React from 'react'

export interface CollapsePanelProps extends React.DOMAttributes<HTMLDivElement> {
  id?: React.Key
  header?: React.ReactNode
  arrow?: boolean
  classNames?: {
    root?: string
    header?: string
  }
  // 视为 classNames.root
  className?: string
  styles?: {
    root?: React.CSSProperties
    header?: React.CSSProperties
  }
  // 视为 styles.root
  style?: React.CSSProperties
  keepMounted?: boolean
  unmountOnExit?: boolean
}
