import type { ForwardedRef } from 'react'

import { attachDisplayName } from '@comps/_shared/utils'
import { forwardRef } from 'react'

import type { HolderProps, HolderRef } from './props'

function _Holder(_props: HolderProps, _ref: ForwardedRef<HolderRef>) {
  return <div>123</div>
}

attachDisplayName(_Holder)

const Holder = forwardRef(_Holder)

export default Holder
