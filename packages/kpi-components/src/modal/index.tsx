// utils
import { fallback, isNull, isNullish, pick, withDefaults } from '@kpi-ui/utils'
import cls from 'classnames'
import { useId } from 'react'
import { usePrefixCls } from '../_shared/hooks'
// comps
import FocusTrap from '../_internal/focus-trap'
import Overlay from '../_internal/overlay'
import Button from '../button'
// types
import type { ModalProps } from './props'

const included = [
  'container',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

function Modal(props: ModalProps) {
  const { children, open, transitions, title, footer } = props

  const prefixCls = usePrefixCls('modal')

  const ariaId = useId()

  return (
    <Overlay
      {...pick(props, included)}
      transitions={{
        mask: fallback(transitions?.mask, 'kpi-fade-in'),
        content: fallback(transitions?.content, 'kpi-slide-bottom'),
      }}
      classNames={{
        mask: `${prefixCls}-mask`,
        wrap: `${prefixCls}-wrap`,
      }}
    >
      <div
        role="dialog"
        aria-labelledby={title ? ariaId : undefined}
        aria-modal="true"
        className={cls(prefixCls, props.className)}
        style={props.style}
      >
        <FocusTrap>
          <div className={`${prefixCls}__content`}>
            <button
              type="button"
              aria-label="close"
              className={`${prefixCls}__closer`}
              onClick={() => props.onOpenChange?.(!open)}
            >
              X
            </button>
            <div className={`${prefixCls}__header`}>
              {!isNullish(title) && (
                <span id={ariaId} className={`${prefixCls}__title`}>
                  {title}
                </span>
              )}
            </div>
            <div className={`${prefixCls}__body`}>{children}</div>
            {!isNull(footer) && (
              <div className={`${prefixCls}__footer`}>
                <Button>取消</Button>
                <Button variant="filled">确定</Button>
              </div>
            )}
          </div>
        </FocusTrap>
      </div>
    </Overlay>
  )
}

export default withDefaults(Modal)

/**
 * 需要干什么?
 */
