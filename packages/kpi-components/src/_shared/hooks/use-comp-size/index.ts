import { fallback } from '@kpi-ui/utils'
import { SizeContext, type SizeType } from '../../context'

export default function useCompSize(size?: SizeType) {
  return fallback(size, SizeContext.useState())
}
