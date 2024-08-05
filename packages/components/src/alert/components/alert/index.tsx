import type { ForwardedRef } from 'react'

import { CSSTransition } from '@comps/_shared/components'
import { getPresetStatusIcon, styledAttrs } from '@comps/_shared/constants'
import { ConfigContext } from '@comps/_shared/contexts'
import { useClosableState, usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, cls, withDefaults, withFallbackCloneElement } from '@comps/_shared/utils'
import { fallback, isNullish, omit } from '@internal/utils'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

import type { AlertProps, AlertRef } from './props'

import useFormatClass from './hooks/use_format_class'

const excluded = [
  'action',
  'onClose',
  'afterClose',
  'banner',
  'closable',
  'closeIcon',
  'description',
  'icon',
  'message',
  'showIcon',
  'type',
  ...styledAttrs,
] as const

function _Alert(_props: AlertProps, ref: ForwardedRef<AlertRef>) {
  const props = withDefaults(_props, {
    showIcon: fallback(_props.showIcon, !!_props.banner),
    type: fallback(_props.type, _props.banner ? 'warning' : 'info'),
  })

  const { action, showIcon, icon, type, message, description, onClose, afterClose } = props

  const { alert: alertContext } = ConfigContext.useState()

  const instance = useRef<HTMLDivElement>(null)

  const prefixCls = usePrefixCls('alert')

  const classNames = useFormatClass(prefixCls, props, alertContext)

  const styles = useSemanticStyles(props, alertContext)

  const [visible, setVisible] = useState(true)

  useImperativeHandle(ref, () => ({
    get nativeElement() { return instance.current },
  }), [instance])

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    onClose && onClose(e)

    if (e.defaultPrevented) return

    setVisible(false)
  }

  const statusIcon = useMemo(() => {
    if (!showIcon) return null

    const _statusIcon = fallback(icon, getPresetStatusIcon(type))

    return withFallbackCloneElement(_statusIcon, {
      fallback: <span className={classNames.icon} style={styles.icon}>{_statusIcon}</span>,
      props: _original => ({
        className: cls(_original.className, classNames.icon),
        style: { ..._original.style, ...styles.icon },
      }),
    })
  }, [classNames.icon, icon, showIcon, styles.icon, type])

  const [_, mergedCloseIcon] = useClosableState(props, alertContext, {
    closeIconRender: icon => (
      <button
        className={classNames.closeBtn}
        style={styles.closeBtn}
        tabIndex={0}
        type="button"
        onClick={handleClose}
      >
        {icon}
      </button>
    ),
  })

  const attrs = omit(props, excluded)

  return (
    <CSSTransition
      unmountOnExit
      duration={{ appear: 0, enter: 0 }}
      name={`${prefixCls}-motion`}
      when={visible}
      onExit={(el) => { el.style.height = `${el.offsetHeight}px` }}
      onExited={afterClose}
      onExiting={(el) => { el.style.height = '0' }}
    >
      <div ref={instance} className={classNames.root} style={styles.root} {...attrs}>
        {statusIcon}
        <div className={classNames.content} style={styles.content}>
          <div className={classNames.message} style={styles.message}>{message}</div>
          {!isNullish(description) && (
            <div className={classNames.description} style={styles.description}>
              {description}
            </div>
          )}
        </div>
        {!isNullish(action) && <div className={classNames.action} style={styles.action}>{action}</div>}
        {mergedCloseIcon}
      </div>
    </CSSTransition>
  )
}

attachDisplayName(_Alert)

const Alert = forwardRef(_Alert)

export default Alert
