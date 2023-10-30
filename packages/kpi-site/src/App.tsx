/* eslint-disable no-param-reassign */
import { forwardRef, useState } from 'react'

import { GroupTransition } from './transition'
import './style.css'

const Red = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 400,
        borderRadius: '4px',
        backgroundColor: 'red',
      }}
    />
  )
})
const Blue = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 400,
        borderRadius: '4px',
        backgroundColor: 'blue',
      }}
    />
  )
})

export default function App() {
  const [list, setList] = useState<string[]>(() => [])
  const [when, setWhen] = useState(true)
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            // setList(list.toString() === '1,2,3' ? [2, 4] : [1, 2, 3])
          }}
        >
          change
        </button>
        <button
          type="button"
          onClick={() => {
            setWhen((p) => !p)
          }}
        >
          toggle
        </button>
      </div>

      {/* 列表 */}
      <input
        onChange={(e) => {
          const val = e.target.value
          setList(val === '1' ? ['is required field'] : ['should must 34'])
        }}
      />
      {list.length > 0 && (
        <div>
          <GroupTransition
            name="err-list"
            appear
            onEnter={(el) => {
              const dom = el as any
              dom._height = el.scrollHeight
              dom.style.height = '0px'
            }}
            onEntering={(el) => {
              const dom = el as any
              dom.style.height = `${dom._height}px`
            }}
            onEntered={(el) => {
              el.style.height = ''
            }}
            onEnterCancel={(el) => {
              el.style.height = ''
            }}
            onExit={(el) => {
              el.style.height = `${el.scrollHeight}px`
            }}
            onExiting={(el) => {
              el.style.height = '0px'
            }}
            onExitCancel={(el) => {
              el.style.height = ''
            }}
          >
            {list.map((id) => (
              <div key={id} className="a">
                {id}
              </div>
            ))}
          </GroupTransition>
          <div>end</div>
        </div>
      )}
    </div>
  )
}

// import { Button, Form, Space } from '@kpi/ui'
// import { useState } from 'react'
// import kv from '@kpi/validate'
// import './style.css'

// function Input(props: any) {
//   return <input {...props} value={props.value || ''} style={{ height: 32 }} />
// }

// export default function App() {
//   const [noStyle, setNoStyle] = useState(false)
//   const [noRule, setNoRule] = useState(false)
//   const [inputNumber, setInputNumber] = useState(30)

//   return (
//     <div>
//       {/* <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
//         测试 {inputNumber || 0} 个输入框场景下 Form 组件的性能
//       </p>
//       <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
//         <Button type="primary" onClick={() => setNoStyle((p) => !p)}>
//           NoStyle: {noStyle ? 'true' : 'false'}
//         </Button>
//         <Button type="primary" onClick={() => setNoRule((p) => !p)}>
//           NoRule: {noRule ? 'true' : 'false'}
//         </Button>
//         <span>input number</span>
//         <Input value={inputNumber} onChange={(e) => setInputNumber(parseInt(e.target.value, 10))} />
//       </Space>
//       <Form
//         style={{
//           width: 600,
//           margin: '0 auto',
//         }}
//       >
//         {Array.from({ length: inputNumber }, (_, i) => (
//           <Form.Item
//             key={i}
//             label="123123"
//             noStyle={noStyle}
//             name={['username', i]}
//             rule={kv.string().min(3).max(4).required()}
//           >
//             <Input placeholder={`username-${i}`} />
//           </Form.Item>
//         ))}
//       </Form> */}
//     </div>
//   )
// }
