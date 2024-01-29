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
import useModalStore from './hooks/use_modal_store'
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
  maskClosable: true,
  restoreFocus: true,
}

function Modal(_props: ModalProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    children: _children,
    open,
    title,
    footer,
    transitions = {},
    onOk,
    onCancel,
    modalRender,
  } = props

  const store = useModalStore()

  const ariaId = useId()

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-modal`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(props.style, props.styles)

  const onKeyDown = !props.closeOnEscape
    ? undefined
    : (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Keyboard.esc) onCancel && onCancel()
      }

  const onClick = !props.maskClosable
    ? undefined
    : (e: React.SyntheticEvent) => {
        if (e.target && e.target === store.wrap.current) {
          onCancel && onCancel()
        }
      }

  const onTrapExit = !props.restoreFocus
    ? undefined
    : (node: Element | null) => {
        node && (node as HTMLElement).focus()
      }

  const children = (
    <div className={classNames.main} style={styles.main}>
      <button
        type="button"
        aria-label="close"
        className={classNames.close}
        style={styles.close}
        onClick={onCancel}
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
          <Button onClick={onCancel}>取消</Button>
          <Button variant="filled" onClick={onOk}>
            确定
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Overlay
      {...pick(props, included)}
      classNames={{ mask: `${prefixCls}-mask` }}
      transitions={{
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
      }}
      onBeforeOpen={store.wrap.show}
      onAfterClose={store.wrap.hide}
    >
      {(ref) => (
        <div
          tabIndex={-1}
          ref={store.wrap}
          onKeyDown={onKeyDown}
          onClick={onClick}
          className={`${prefixCls}-wrap`}
        >
          <div
            role="dialog"
            ref={ref}
            aria-labelledby={title ? ariaId : undefined}
            aria-modal="true"
            className={classNames.root}
            style={styles.root}
          >
            <FocusTrap active={open} onExit={onTrapExit}>
              {isFunction(modalRender) ? modalRender(children) : children}
            </FocusTrap>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default withDisplayName(Modal)
