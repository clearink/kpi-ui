// utils
import { fallback, isNull, isNullish, pick, withDefaults, withDisplayName } from '@kpi-ui/utils'
import cls from 'classnames'
import { useId } from 'react'
import Overlay from '../_internal/overlay'
import { usePrefixCls } from '../_shared/hooks'
// comps
import Button from '../button'
// types
import type { DrawerProps } from './props'

const included = [
  'getContainer',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

export const defaultProps: Partial<DrawerProps> = {}

function Drawer(_props: DrawerProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, open, transitions = {}, title, footer } = props

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-drawer`

  const ariaId = useId()

  return (
    <Overlay
      {...pick(props, included)}
      transitions={{
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
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

export default withDisplayName(Drawer)
