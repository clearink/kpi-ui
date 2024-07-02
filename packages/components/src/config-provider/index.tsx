import { TouchEffectContext } from '_shared/contexts'

import type { ConfigProviderProps } from './props'

import { DisabledContext } from './contexts/disabled'
import { SizeContext } from './contexts/size'

function ConfigProvider(props: ConfigProviderProps) {
  const { children, touchEffect = {} } = props

  return (
    <TouchEffectContext.Provider value={touchEffect}>
      <DisabledContext.Provider value={undefined}>
        <SizeContext.Provider value={undefined}>{children}</SizeContext.Provider>
      </DisabledContext.Provider>
    </TouchEffectContext.Provider>
  )
}

export default ConfigProvider
