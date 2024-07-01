import { FocusTrap, Overlay } from '_shared/components'
import { Keyboard } from '_shared/constants'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { fallback, isNull, isNullish, pick, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useId } from 'react'

import Button from '../button'
import useFormatClass from './hooks/use_format_class'
import type { DrawerProps } from './props'

const included = [
  'getContainer',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

const defaultProps: Partial<DrawerProps> = {
  closeOnEscape: true,
}

function Drawer(_props: DrawerProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, open, title, footer, style, styles: _styles, transitions = {} } = props

  const ariaId = useId()

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-drawer`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const onEscape = props.closeOnEscape
    ? (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Keyboard.esc) props.onOpenChange?.(!open)
      }
    : undefined

  return (
    <Overlay
      {...pick(props, included)}
      transitions={{
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
      }}
      classNames={{
        mask: `${prefixCls}-mask`,
      }}
    >
      <div
        role="dialog"
        aria-labelledby={title ? ariaId : undefined}
        aria-modal="true"
        className={classNames.root}
        style={styles.root}
      >
        <FocusTrap active={open}>
          <div className={classNames.main} style={styles.main}>
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
              {children}
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
    </Overlay>
  )
}

export default withDisplayName(Drawer)
