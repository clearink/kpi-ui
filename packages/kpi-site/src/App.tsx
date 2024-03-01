import { Button, Form, Tooltip } from '@kpi-ui/components'
import { useMemo, useState } from 'react'
import kv from '@kpi-ui/validator'
import GroupTransition from '@kpi-ui/components/src/_internal/transition/components/group-transition'

import '@kpi-ui/components/src/style'
import './style.scss'

const Input = (props: any) => {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  const [open, setOpen] = useState(false)
  const items = open ? ['is a required field'] : ['must be at least 3 characters']
  return (
    <div style={{ width: 600, margin: '100px auto' }}>
      {useMemo(
        () => (
          <Form tag="div">
            {Array.from({ length: 3000 }, (_, i) => (
              <Form.Item
                key={i}
                label={`username-${i}`}
                name={['username', i]}
                rule={kv
                  .string()
                  .min(3)
                  .max(6)
                  // .email(<div style={{ height: 40 }}>is email</div>)
                  .required()}
              >
                <Input />
              </Form.Item>
            ))}
          </Form>
        ),
        []
      )}

      <div>
        <Button onClick={() => setOpen((p) => !p)}>{`${open}`}</Button>
        <GroupTransition
          tag="div"
          name="kpi-form-item-message-error"
          {...{
            onEnter: (el) => {
              el.style.height = '0px'
            },
            onEntering: (el) => {
              el.style.height = `${el.scrollHeight}px`
            },
            onEntered: (el) => {
              el.style.height = ''
            },
            onExit: (el) => {
              el.style.height = `${el.clientHeight}px`
            },
            onExiting: (el) => {
              el.style.height = '0px'
            },
          }}
        >
          {items.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </GroupTransition>
        <div>next line</div>
      </div>
    </div>
    // <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    //   <div style={{ padding: 400 }}>
    //     {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
    //       <div style={{ position: 'absolute', left: 400, top: 200 }}>
    //         <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
    //     <Tooltip open content={<div>12313211212</div>}>
    //       <textarea style={{ position: 'relative', top: 20 }} />
    //     </Tooltip>
    //     {/* </div>
    //       </div>
    //     </div> */}
    //   </div>
    // </div>
  )
}
