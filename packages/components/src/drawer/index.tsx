import { FocusTrap, Overlay } from '@comps/_shared/components'
import { usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { fallback, isNullish, pick } from '@internal/utils'
import { useId } from 'react'

import Button from '../button'
import useFormatClass from './hooks/use_format_class'
import { type DrawerProps, defaultDrawerProps } from './props'

const included = [
  'getContainer',
  'mask',
  'open',
  'transitions',
  'keepMounted',
  'unmountOnExit',
] as const

function Drawer(_props: DrawerProps) {
  const props = withDefaults(_props, defaultDrawerProps)

  const { children, footer, open, title, transitions = {} } = props

  const ariaId = useId()

  const prefix = usePrefixCls()

  const prefixCls = `${prefix}-drawer`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(props)

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
        content: fallback(transitions.content, `${prefix}-slide-bottom`),
        mask: fallback(transitions.mask, `${prefix}-fade-in`),
      }}
    >
      <div
        className={classNames.root}
        style={styles.root}
        aria-labelledby={title ? ariaId : undefined}
        aria-modal="true"
        role="dialog"
      >
        <FocusTrap active={open}>
          <div className={classNames.main} style={styles.main}>
            <button
              className={classNames.close}
              style={styles.close}
              aria-label="close"
              type="button"
              onClick={() => props.onOpenChange?.(!open)}
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
            {!isNullish(footer) && (
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

attachDisplayName(Drawer)

export default Drawer
