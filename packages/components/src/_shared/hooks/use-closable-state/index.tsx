import type { HasClosable, HasIconRenderClosable } from '@comps/_shared/types'
import type { MayBe } from '@internal/types'
import type { ReactNode } from 'react'

import { withDefaults } from '@comps/_shared/utils'
import CloseOutlined from '@ink-ui/icons/esm/icons/CloseOutlined'
import { useMemo } from 'react'

import formatIcon from './utils/format_icon'
import formatState from './utils/format_state'

export function useClosableState(
  props?: HasClosable,
  ctx?: MayBe<HasClosable>,
  defaults?: HasIconRenderClosable,
) {
  const propsState = useMemo(() => formatState(props), [props])

  const ctxState = useMemo(() => formatState(ctx), [ctx])

  const defaultConfig = useMemo(() => {
    return withDefaults(defaults || {}, { closeIcon: <CloseOutlined /> })
  }, [defaults])

  return useMemo<[boolean, ReactNode]>(() => {
    const closableConfig = (() => {
      if (propsState === false) return false

      if (propsState) return withDefaults(propsState, ctxState || null, defaultConfig)

      if (ctxState === false) return false

      if (ctxState) return withDefaults(ctxState, defaultConfig)

      return defaultConfig.closable ? defaultConfig : false
    })()

    if (closableConfig === false) return [false, null]

    return [true, formatIcon(closableConfig, defaultConfig)]
  }, [propsState, ctxState, defaultConfig])
}
