import { fallback, isNull, isNullish, pick, withDefaults } from '@kpi-ui/utils'
import Overlay from '../_internal/overlay'
import { usePrefixCls } from '../_shared/hooks'
import cls from 'classnames'

import type { DrawerProps } from './props'
import { useId } from 'react'
import Button from '../button'

const included = [
  'container',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

function Drawer(props: DrawerProps) {
  const { children, open, transitions, title, footer } = props

  const prefixCls = usePrefixCls('drawer')

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
        <div tabIndex={0} aria-hidden="true" className={`${prefixCls}__sentinel`}></div>
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
        <div tabIndex={0} aria-hidden="true" className={`${prefixCls}__sentinel`}></div>
      </div>
    </Overlay>
  )
}

export default withDefaults(Drawer)

/**
 * 需要干什么?
 */
