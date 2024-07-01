import type { ReactNode } from 'react'

import type { ExternalFormInstance } from '../form/control/props'

export type Forms = Record<string, ExternalFormInstance>

export interface InternalFormProviderProps {
  children: ReactNode
}
