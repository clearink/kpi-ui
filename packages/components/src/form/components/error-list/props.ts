import type { ReactNode } from 'react'

import type { ValidateStatus } from '../../props'

export interface FormErrorListProps {
  className?: string
  errors?: ReactNode[]
  help?: ReactNode
  helpStatus?: ValidateStatus
  onExitComplete?: () => void
  warnings?: ReactNode[]
}
