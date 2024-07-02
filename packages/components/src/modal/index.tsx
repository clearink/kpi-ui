import Button from '@/button'
import {
  fallback,
  isFunction,
  isNull,
  isNullish,
  pick,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { FocusTrap, Overlay } from '_shared/components'
import { Keyboard } from '_shared/constants'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { hideElement, showElement } from '_shared/utils'
import { type KeyboardEvent, type SyntheticEvent, useId, useRef } from 'react'

import type { ModalProps } from './props'

import useFormatClass from './hooks/use_format_class'

const included = [
  'getContainer',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
  'zIndex',
] as const

const defaultProps: Partial<ModalProps> = {
  closeOnEscape: true,
  mask: true,
  maskClosable: true,
  returnFocus: true,
}

function Modal(_props: ModalProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    children,
    footer,
    modalRender,
    onCancel,
    onOk,
    open,
    style,
    styles: _styles,
    title,
    transitions = {},
  } = props

  const $wrap = useRef<HTMLDivElement | null>(null)

  const ariaId = useId()

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-modal`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const onEscapeDown = !props.closeOnEscape
    ? undefined
    : (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== Keyboard.esc) return

        e.stopPropagation()

        onCancel?.()
      }

  const onMaskClick
    = !props.maskClosable || !props.mask
      ? undefined
      : (e: SyntheticEvent) => {
          if (e.target && e.target === $wrap.current)
            onCancel?.()
        }

  const onTrapExit = !props.returnFocus
    ? undefined
    : (node: Element | null) => {
        const el = node as HTMLElement | null

        if (el && isFunction(el.focus)) el.focus()
      }

  const renderNode = (
    <div className={classNames.main} style={styles.main}>
      <button
        aria-label="close"
        className={classNames.close}
        onClick={onCancel}
        style={styles.close}
        type="button"
      >
        X
      </button>
      <div className={classNames.header} style={styles.header}>
        {!isNullish(title) && (
          <span className={`${prefixCls}__title`} id={ariaId}>
            {title}
          </span>
        )}
      </div>
      <div className={classNames.body} style={styles.body}>
        {children}
      </div>
      {!isNull(footer) && (
        <div className={classNames.footer} style={styles.footer}>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={onOk} variant="filled">
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
      onEnter={() => {
        showElement($wrap.current)
      }}
      onExited={() => {
        hideElement($wrap.current)
      }}
      transitions={{
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
      }}
    >
      {ref => (
        <div
          className={`${prefixCls}-wrap`}
          onClick={onMaskClick}
          onKeyDown={onEscapeDown}
          ref={$wrap}
          tabIndex={-1}
        >
          <div
            aria-labelledby={title ? ariaId : undefined}
            aria-modal="true"
            className={classNames.root}
            ref={ref}
            role="dialog"
            style={styles.root}
          >
            <FocusTrap active={open} onExit={onTrapExit}>
              {isFunction(modalRender) ? modalRender(renderNode) : renderNode}
            </FocusTrap>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default withDisplayName(Modal)
