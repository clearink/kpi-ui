import { pick, withDefaults } from '@kpi-ui/utils'
import Overlay from '../_internal/overlay'

import type { ModalProps } from './props'
import { usePrefixCls } from '../_shared/hooks'

const included = ['open', 'forceRender', 'destroyOnClose', 'container'] as const

function Modal(props: ModalProps) {
  // const {  ...restProps } = props
  const prefixCls = usePrefixCls('modal')

  const overlayProps = pick(props, included)

  return (
    <Overlay
      {...overlayProps}
      transitions={{ mask: 'kpi-fade-in', content: 'kpi-slide-bottom' }}
      classNames={{
        root: `${prefixCls}__root`,
        mask: `${prefixCls}__mask`,
        wrap: `${prefixCls}__wrap`,
      }}
    >
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}__content`}>
          <div className={`${prefixCls}__header`}></div>
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
