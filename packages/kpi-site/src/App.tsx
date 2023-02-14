import { Form } from '@kpi/ui'
import { useEffect, useReducer } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  const start = performance.now()
  useEffect(() => {
    console.log('diff', performance.now() - start)
  }, [start])
  const forceUpdate = useReducer((c) => c + 1, 0)[1]
  const form = Form.useForm()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          forceUpdate()
        }}
      >
        forceUpdate
      </button>
      <button
        type="button"
        onClick={() => {
          console.log(form.getFieldsValue())
        }}
      >
        getFieldsValue
      </button>
      <Form as="div" form={form}>
        {/* {Array.from({ length: 3000 }, (_, i) => (
          <Form.Item noStyle key={i} name={['name', i]}>
            <Input placeholder={`name-${i}`} />
          </Form.Item>
        ))} */}
        <Form.List name="username" initialValue={Array(3000).fill(1)}>
          {(fields) => {
            return fields.map((field) => (
              <Form.Item noStyle {...field}>
                <Input placeholder={field.name} />
              </Form.Item>
            ))
          }}
        </Form.List>
      </Form>
    </div>
  )
}
