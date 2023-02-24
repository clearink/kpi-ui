import { Form, Button, Space } from '@kpi/ui'
import kv from '@kpi/validate'
import { useEffect, useLayoutEffect, useReducer, useState } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const [noStyle, setNoStyle] = useState(true)
  const [noRule, setNoRule] = useState(true)
  const [inputNumber, setInputNumber] = useState(3000)

  const start = performance.now()
  setTimeout(() => {
    console.log('diff:setTimeout', performance.now() - start)
  })
  useLayoutEffect(() => {
    console.log('diff:useLayoutEffect', performance.now() - start)
  }, [start])
  useEffect(() => {
    console.log('diff:useEffect', performance.now() - start)
  }, [start])

  return (
    <div>
      <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        测试 3000 个输入框常见下 Form 组件的性能
      </p>
      <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Button type="primary" onClick={() => setNoStyle((p) => !p)}>
          NoStyle: {noStyle ? 'true' : 'false'}
        </Button>
        <Button type="primary" onClick={() => setNoRule((p) => !p)}>
          NoRule: {noStyle ? 'true' : 'false'}
        </Button>
        <span>input number</span>
        <Input value={inputNumber} onChange={(e) => setInputNumber(parseInt(e.target.value, 10))} />
      </Space>
      <Form as="div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {Array.from({ length: inputNumber }, (_, i) => (
          <Form.Item
            key={i}
            label="123123"
            noStyle={noStyle}
            name={['username', i]}
            rule={noRule ? undefined : kv.string().required()}
          >
            <Input placeholder={`username-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
