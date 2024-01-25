// utils
import {
  fallback,
  isFunction,
  isNull,
  isNullish,
  pick,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import React, { useId } from 'react'
import { Keyboard } from '../_shared/constants'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
// comps
import FocusTrap from '../_internal/focus-trap'
import Overlay from '../_internal/overlay'
import Button from '../button'
// types
import type { ModalProps } from './props'

const included = [
  'getContainer',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

export const defaultProps: Partial<ModalProps> = {
  closeOnEscape: true,
}

function Modal(_props: ModalProps) {
  const props = withDefaults(_props, defaultProps)

  const { children: _children, open, title, footer, modalRender, transitions = {} } = props

  const ariaId = useId()

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-modal`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(props.style, props.styles)

  const wrapAttrs = props.closeOnEscape
    ? {
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === Keyboard.esc) props.onOpenChange?.(!open)
        },
      }
    : undefined

  const children = (
    <div
      role="dialog"
      aria-labelledby={title ? ariaId : undefined}
      aria-modal="true"
      className={classNames.root}
      style={styles.root}
    >
      <FocusTrap active={open}>
        <div className={classNames.main}>
          <button
            type="button"
            aria-label="close"
            className={classNames.close}
            style={styles.close}
            onClick={() => props.onOpenChange?.(!open)}
          >
            X
          </button>
          <div className={classNames.header} style={styles.header}>
            {!isNullish(title) && (
              <span id={ariaId} className={`${prefixCls}__title`}>
                {title}
              </span>
            )}
          </div>
          <div className={classNames.body} style={styles.body}>
            {_children}
          </div>
          {!isNull(footer) && (
            <div className={classNames.footer} style={styles.footer}>
              <Button>取消</Button>
              <Button variant="filled">确定</Button>
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  )

  return (
    <Overlay
      {...pick(props, included)}
      attrs={{ wrap: wrapAttrs }}
      transitions={{
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
      }}
      classNames={{
        mask: `${prefixCls}-mask`,
        wrap: `${prefixCls}-wrap`,
      }}
    >
      {isFunction(modalRender) ? modalRender(children) : children}
    </Overlay>
  )
}

export default withDisplayName(Modal)

/**
 * 需要干什么?
 */
