import { DisabledContext, SizeContext, ConfigContext } from '../_shared/context'

import type { ConfigProviderProps } from './props'

function ConfigProvider(props: ConfigProviderProps) {
  const { children, ...restProps } = props
  return (
    <ConfigContext.Provider value={restProps}>
      {children}
      {/* <DisabledContext.Provider value={componentDisabled}>
        <SizeContext.Provider value={componentSize}>{children}</SizeContext.Provider>
      </DisabledContext.Provider> */}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
