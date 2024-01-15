import { Modal, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'
import { CSSTransition } from '@kpi-ui/components/src/_internal/transition'
import Overlay from '@kpi-ui/components/src/_internal/overlay'

export default function App() {
  const [open, set] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const prefixCls = 'kpi-modal'
  return (
    <div style={{ margin: 100 }}>
      <Button
        variant="filled"
        onClick={() => {
          set((p) => !p)
        }}
      >
        minus
      </Button>
      {/* <Modal open={open} unmountOnExit onOpenChange={set}>
        <div>div</div>
      </Modal> */}
      <Overlay
        open={open}
        mask={false}
        transitions={{ mask: 'kpi-fade-in', content: 'kpi-slide-bottom' }}
        classNames={{
          mask: `${prefixCls}-mask`,
          wrap: `${prefixCls}-wrap`,
        }}
      >
        <div role="dialog" aria-modal="true" className={`${prefixCls}`}>
          <div className={`${prefixCls}__content`}>
            <div className={`${prefixCls}__header`}>
              <div onClick={() => set(false)}>close</div>
            </div>
            <div className={`${prefixCls}__body`}>
              <div>a</div>
            </div>
            <div className={`${prefixCls}__footer`}></div>
          </div>
        </div>
      </Overlay>

      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
