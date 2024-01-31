// utils
import { useRef } from 'react'
import { ZIndexContext } from '../../../config-provider/contexts/z_index'

export default function useZIndex() {
  const zIndexContext = ZIndexContext.useState()
  return zIndexContext.getZIndex()
}
