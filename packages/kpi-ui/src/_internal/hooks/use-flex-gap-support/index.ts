import { useIsomorphicEffect } from '@kpi/shared'
import { useState } from 'react'
import detectFlexGap from './detect_flex_gap'

// 是否支持 flex gap 属性
export default function useFlexGapSupport() {
  const [support, setSupport] = useState(detectFlexGap)

  useIsomorphicEffect(() => setSupport(detectFlexGap()), [])

  return support
}
