// form 的使用方法
export default function App(){
  const form = Form.useKpiForm()
  // 监听值改变
  const value = Form.useWatch('name', form)
  const schema = useMemo(()=>{
    return k.object({
      name: k.string().phone().required(),
      age: k.number().min(0).max(100),
      'some.special': k.string().required(),
      deep:{
        deep: k.number().min(12).max(24),
        any: k.any()
      },
      union: k.or([k.string(), k.number()]),
      and: k.and([k.string().array(), k.number().array()]),
      // 当依赖值变更时触发该函数
      // 能否当作另一种的 Form.useWatch 呢？
      // 目前还没有想好 callback 的设计
      when: k.any().when([['deep', 'deep'], 'age'], ([deep, aeg], schema)=>{
        return schema.required()
      }),
      enums: k.enum(['a', 'b', 'c']),
      valid: k.valid(['a', 'b', 'c']), // 可以不实现
      invalid: k.invalid(['a', 'b', 'c']), // 可以不实现
    })

  },[])
  return (
    // 可以通过 schema 自动推导出 formValues 的类型
    <Form schema={schema} form={form}>
      {/* 特殊情况需要判断，可以自行扩展 rules */}
      {visible && (
        // Form.Item 组件卸载后自动
        <Form.Item name="name" rules={rules=>rules.required()}>
        <Input />
      </Form.Item>
      )}
      <Form.Item name="age">
        <InputNumber />
      </Form.Item>
      <Form.Item name="some.special">
        <InputNumber />
      </Form.Item>
      <Form.Item name={['deep', 'deep']}>
        <InputNumber />
      </Form.Item>
      <Form.Item name={['deep', 'any']} rules={}>
        <InputNumber />
      </Form.Item>
    </Form>
  )
}