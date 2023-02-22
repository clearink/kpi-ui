import { Form, Button } from '@kpi/ui'
import kv from '@kpi/validate'
import { useEffect, useLayoutEffect, useReducer } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
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
  const forceUpdate = useReducer((c) => c + 1, 0)[1]
  return (
    <div>
      <Button onClick={() => forceUpdate()}>forceUpdate</Button>
      <Form as="div">
        <Form.Item name="a" initialValue="a1">
          <Input />
        </Form.Item>
        <Form.Item name="a" initialValue="a2">
          <Input />
        </Form.Item>
        <Form.List name="username" initialValue={Array(3000).fill(1)}>
          {(fields) => {
            return fields.map((field) => (
              <Form.Item label="123123" {...field} rule={kv.string().required()}>
                <Input placeholder={`name-${field.name}`} />
              </Form.Item>
            ))
          }}
        </Form.List>
      </Form>
    </div>
  )
}
