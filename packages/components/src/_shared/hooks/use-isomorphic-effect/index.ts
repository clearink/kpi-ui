import { isBrowser } from '@kpi-ui/utils'
import React from 'react'

// SSR 时无法执行 React.useEffect 故使用 React.useLayoutEffect
export const useIsomorphicEffect = isBrowser ? React.useLayoutEffect : React.useEffect
