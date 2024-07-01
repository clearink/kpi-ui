import type { ReactNode } from 'react'

import type { ValidateStatus } from '../../props'

export interface FormErrorListProps {
  errors?: ReactNode[]
  warnings?: ReactNode[]
  help?: ReactNode
  helpStatus?: ValidateStatus
  className?: string
  onExitComplete?: () => void
}
