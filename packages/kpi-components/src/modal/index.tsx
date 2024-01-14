import { pick, withDefaults } from '@kpi-ui/utils'
import Overlay from '../_internal/overlay'

import type { ModalProps } from './props'
import { usePrefixCls } from '../_shared/hooks'

const included = ['open', 'mountOnEnter', 'unmountOnExit', 'container'] as const

function Modal(props: ModalProps) {
  // const {  ...restProps } = props
  const prefixCls = usePrefixCls('modal')

  const overlayProps = pick(props, included)

  return (
    <Overlay
      {...overlayProps}
      transitions={{ mask: 'kpi-fade-in', content: 'kpi-slide-bottom' }}
      classNames={{
        mask: `${prefixCls}-mask`,
        wrap: `${prefixCls}-wrap`,
      }}
    >
      <div role="dialog" aria-modal="true" className={`${prefixCls}`}>
        <div className={`${prefixCls}__content`}>
          <div className={`${prefixCls}__header`}>
            <div onClick={() => props.onOpenChange?.(!props.open)}>close</div>
          </div>
          <div className={`${prefixCls}__body`}>{props.children}</div>
          <div className={`${prefixCls}__footer`}></div>
        </div>
        {/* <div
          onClick={() => {
            props.onOpenChange?.(!props.open)
          }}
        >
          close
        </div>
        <div>{props.children}</div> */}
      </div>
    </Overlay>
  )
}

export default withDefaults(Modal)

/**
 * 需要干什么?
 */
