import { fallback, isNull, isNullish, pick, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { FocusTrap, Overlay } from '_shared/components'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { useId } from 'react'

import type { DrawerProps } from './props'

import Button from '../button'
import useFormatClass from './hooks/use_format_class'

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

  const { children, footer, open, style, styles: _styles, title, transitions = {} } = props

  const ariaId = useId()

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-drawer`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  // const onEscapeDown = !props.closeOnEscape
  //   ? undefined
  //   : (e: React.KeyboardEvent<HTMLDivElement>) => {
  //       if (e.key === Keyboard.esc) return

  //       props.onOpenChange?.(!open)
  //     }

  return (
    <Overlay
      {...pick(props, included)}
      classNames={{
        mask: `${prefixCls}-mask`,
      }}
      transitions={{
        content: fallback(transitions.content, `${rootPrefixCls}-slide-bottom`),
        mask: fallback(transitions.mask, `${rootPrefixCls}-fade-in`),
      }}
    >
      <div
        aria-labelledby={title ? ariaId : undefined}
        aria-modal="true"
        className={classNames.root}
        role="dialog"
        style={styles.root}
      >
        <FocusTrap active={open}>
          <div className={classNames.main} style={styles.main}>
            <button
              aria-label="close"
              className={classNames.close}
              onClick={() => props.onOpenChange?.(!open)}
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
