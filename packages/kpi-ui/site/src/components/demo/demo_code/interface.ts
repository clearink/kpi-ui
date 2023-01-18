import { ComponentType } from 'react'
import type { DocumentMatterData } from '../../hocs/with_lazy_load'

export interface DemoCodeProps extends DocumentMatterData {
  component: ComponentType<any>
}
