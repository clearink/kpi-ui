import {
  fallback,
  isFunction,
  isNull,
  isNullish,
  pick,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { Keyboard } from '_shared/constants'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { hideElement, showElement } from '_shared/utils'
import { useId, useRef, type KeyboardEvent, type SyntheticEvent } from 'react'
import useFormatClass from './hooks/use_format_class'
// comps
import Button from '@/button'
import { FocusTrap, Overlay } from '_shared/components'
// types
import type { ModalProps } from './props'

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
  maskClosable: true,
  returnFocus: true,
  mask: true,
}

function Modal(_props: ModalProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    children,
    open,
    title,
    footer,
    onOk,
    onCancel,
    modalRender,
    style,
    styles: _styles,
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

  const onMaskClick =
    !props.maskClosable || !props.mask
      ? undefined
      : (e: SyntheticEvent) => {
          if (e.target && e.target === $wrap.current) {
            onCancel?.()
          }
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
        {children}
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
      onEnter={() => {
        showElement($wrap.current)
      }}
      onExited={() => {
        hideElement($wrap.current)
      }}
    >
      {(ref) => (
        <div
          tabIndex={-1}
          ref={$wrap}
          onKeyDown={onEscapeDown}
          onClick={onMaskClick}
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
              {isFunction(modalRender) ? modalRender(renderNode) : renderNode}
            </FocusTrap>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default withDisplayName(Modal)
