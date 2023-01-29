import React from 'react'

// SSR 时无法执行 React.useEffect 故使用 React.useLayoutEffect
const useIsomorphicEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect
export default useIsomorphicEffect
